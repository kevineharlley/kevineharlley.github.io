// ── Circuit graph construction ─────────────────────────────────────────────
// Pure layout module: builds the navigable graph and assigns device ports.
// No React, no Three.js — safe for SSR and testable in isolation.

import type {
  CircuitComponent,
  DevicePort,
  ResolvedComponent,
  Vec3,
} from "./types";
import { MUX_DEVICE, PASSIVE_DEVICE } from "./types";
import {
  CHIP_DEFS,
  COMPONENT_DEFS,
  MUX_CONNECTIONS,
  MUX_LAYOUT,
} from "./componentDefs";
import type { ChipDef } from "./componentDefs";

// Re-export for consumers that need the type/data
export type { DevicePort, ChipDef };
export { CHIP_DEFS, MUX_LAYOUT };

// ── Types ──────────────────────────────────────────────────────────────────

type NodeType = "normal" | "capacitor" | "transistor";

export interface CircuitNode {
  id: number;
  position: Vec3;
  type: NodeType;
  neighbors: number[];
  layer: number; // 0 = top surface; 1..LAYER_COUNT-1 = inner crystal layers
}

export interface CircuitEdge {
  from: number;
  to: number;
  length: number;
}

export interface Circuit {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  vias: number[];
  viaLinks: { top: number; bottom: number }[]; // vertical connectors into layers
  layerNodes: number[][];  // node ids per layer (index 0 unused)
  layerEdges: CircuitEdge[][]; // edges per layer (index 0 unused)
  // Fast arrival lookup: terminal node → port. Components are the source of
  // truth; this is just an O(1) index for SparkField's hot path.
  portByTerminalNode: Map<number, DevicePort>;
  components: ResolvedComponent[]; // unified component instances — the single registry
}

// ── Layout constants ───────────────────────────────────────────────────────

const H_RAIL_Y = [3.8, -3.8];
const V_RAIL_X = [-6, -3, 0, 3, 6];
const RAIL_SAMPLE = 0.5;
const BOARD_X = [-8, 8] as const;
const BOARD_Y = [-3.8, 3.8] as const;

// Multilayer crystal stack — shared with BoardRenderer so rendering and
// the traversal graph never disagree.
export const LAYER_COUNT = 7;
export const LAYER_SPACING = 0.20;


// ── Helpers ────────────────────────────────────────────────────────────────

// Stable pseudo-random without mutable state
function rng(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Shared multilayer predicates — rendering (BoardRenderer) and the graph
// builder MUST use the same functions so what you see is what sparks traverse.

/** Which inner layer (1..LAYER_COUNT-1) a via plunges to, 0 = surface-only. */
export function viaDepth(viaId: number): number {
  return Math.floor(rng(viaId * 53.7 + 11.1) * LAYER_COUNT);
}

/** Deterministic ~35% subset of top edges that exist on an inner layer. */
export function isLayerEdge(layer: number, fromId: number, toId: number): boolean {
  return rng(layer * 911.3 + fromId * 17.1 + toId * 31.7) > 0.65;
}

function sampleRange(min: number, max: number, step: number, mustInclude: number[]): number[] {
  const set = new Set<number>();
  for (let v = min; v <= max + 1e-6; v += step) set.add(Math.round(v * 1000) / 1000);
  mustInclude.forEach((v) => set.add(Math.round(v * 1000) / 1000));
  return Array.from(set).sort((a, b) => a - b);
}

// ── Graph builder ──────────────────────────────────────────────────────────

function buildCircuit(): Circuit {
  const nodes: CircuitNode[] = [];
  const vias: number [] = [];
  const viaLinks: { top: number; bottom: number }[] = [];
  const layerNodes: number[][] = Array.from({ length: LAYER_COUNT }, () => []);
  const layerEdges: CircuitEdge[][] = Array.from({ length: LAYER_COUNT }, () => []);
  const edges: CircuitEdge[] = [];
  const edgeSet = new Set<string>();
  const nodeIndex = new Map<string, number>();
  const portByTerminalNode = new Map<number, DevicePort>();
  // Unified component registry — built inline as devices are routed.
  const components: ResolvedComponent[] = [];

  const GRID = 0.05;
  const snap = (v: number) => Math.round(v / GRID) * GRID;
  
  const addNode = (x: number, y: number, layer = 0): number => {
    nodes.push({
      id: nodes.length,
      position: [snap(x), snap(y), -layer * LAYER_SPACING],
      type: "normal",
      neighbors: [],
      layer,
    });
    return nodes.length - 1;
  };

  const getOrCreateNode = (x: number, y: number): number => {
    const key = `${Math.round(x * 1000)},${Math.round(y * 1000)}`;
    const existing = nodeIndex.get(key);
    if (existing !== undefined) return existing;
    const id = addNode(x, y);
    nodeIndex.set(key, id);
    return id;
  };

  const addEdge = (a: number, b: number) => {
    if (a === b) return;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    nodes[a].neighbors.push(b);
    nodes[b].neighbors.push(a);
    const pa = nodes[a].position;
    const pb = nodes[b].position;
    const length = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
    edges.push({ from: a, to: b, length });
  };

  const nearestNodeFrom = (ids: number[], x: number, y: number): number => {
    let best = ids[0];
    let bestDist = Infinity;
    for (const id of ids) {
      const p = nodes[id].position;
      const d = Math.hypot(p[0] - x, p[1] - y);
      if (d < bestDist) {
        bestDist = d;
        best = id;
      }
    }
    return best;
  };

  // Rails
  const hXs = sampleRange(BOARD_X[0], BOARD_X[1], RAIL_SAMPLE, V_RAIL_X);
  const hRailNodes: number[][] = H_RAIL_Y.map((y) => {
    const ids = hXs.map((x) => getOrCreateNode(x, y));
    for (let i = 0; i < ids.length - 1; i++) addEdge(ids[i], ids[i + 1]);
    return ids;
  });

  const vYs = sampleRange(BOARD_Y[0], BOARD_Y[1], RAIL_SAMPLE, H_RAIL_Y);
  const vRailNodes: number[][] = V_RAIL_X.map((x) => {
    const ids = vYs.map((y) => getOrCreateNode(x, y));
    for (let i = 0; i < ids.length - 1; i++) addEdge(ids[i], ids[i + 1]);
    return ids;
  });

  const railNodeIds = new Set<number>([...hRailNodes.flat(), ...vRailNodes.flat()]);

  // Unified lane-fan router: pin → shoulder → elbow → terminal.
  // Works for both chips (fewer lanes, converged to rail) and mux (6 lanes).
  // Pin placement is driven by the component's declared PortSpecs.
  const routeLaneFan = (opts: {
    def: CircuitComponent;  // component whose ports are being routed
    device: number;         // chip index or MUX_DEVICE
    side: "top" | "bottom" | "left" | "right";
    layer?: number;          // crystal layer to route on (default 0 = surface)
    railTargets?: number[];  // rail node ids on that layer (defaults to surface rails)
    shoulderLen: number;      // straight run before bend
    bandCenter: number;       // where the bundle converges (along-edge coord)
    bandSpacing: number;      // gap between lanes in the band
    bandDir: 1 | -1;          // which way the band extends from center
    connectToRail?: boolean;  // if true, run single trace from band center to rail
  }): DevicePort[] => {
    const def = opts.def;
    const layer = opts.layer ?? 0;
    const specs = def.ports.filter((p) => p.side === opts.side);
    const [cx, cy] = def.center ?? [0, 0];
    const [w, h] = def.size ?? [0, 0];
    const isVertical = opts.side === "top" || opts.side === "bottom";
    const dir = opts.side === "top" || opts.side === "right" ? 1 : -1;
    const spread = (isVertical ? w : h) * (def.portSpread ?? 0.8);

    const ports: DevicePort[] = [];
    const edgeCoord =
      opts.side === "top" ? cy + h / 2
      : opts.side === "bottom" ? cy - h / 2
      : opts.side === "left" ? cx - w / 2
      : cx + w / 2;

    for (let lane = 0; lane < specs.length; lane++) {
      const spec = specs[lane];
      const pinAlong = isVertical
        ? cx - spread / 2 + spec.t * spread
        : cy - spread / 2 + spec.t * spread;
      const band = opts.bandCenter + opts.bandDir * lane * opts.bandSpacing;

      const pinNode = addNode(
        isVertical ? pinAlong : edgeCoord,
        isVertical ? edgeCoord : pinAlong,
        layer
      );

      const shoulderNode = addNode(
        isVertical ? pinAlong : edgeCoord + dir * opts.shoulderLen,
        isVertical ? edgeCoord + dir * opts.shoulderLen : pinAlong,
        layer
      );

      // vertical side: elbow=(pinAlong, band), terminal=(band, y2)
      const kneeNode = addNode(
        isVertical ? pinAlong : edgeCoord + dir * (opts.shoulderLen + 0.84),
        isVertical ? edgeCoord + dir * (opts.shoulderLen + 0.84) : pinAlong,
        layer
      );
      // shoulder → knee → elbow → terminal: all 90°

      
      const elbowNode = addNode(
        isVertical ? pinAlong : edgeCoord + dir * (opts.shoulderLen + 0.42),
        isVertical ? band : edgeCoord + dir * (opts.shoulderLen + 0.42),
        layer
      );
      const terminalNode = addNode(
        isVertical ? band : edgeCoord + dir * (opts.shoulderLen + 0.84),
        isVertical ? edgeCoord + dir * (opts.shoulderLen + 0.84) : band,
        layer
      );

      addEdge(pinNode, shoulderNode);
      addEdge(shoulderNode, kneeNode);       // axis-aligned
      addEdge(kneeNode, terminalNode);    // axis-aligned
      if (layer > 0) {
        layerEdges[layer].push(edges[edges.length - 1], edges[edges.length - 2], edges[edges.length - 3]);
      }

      const port: DevicePort = {
        terminalNode,
        outwardNode: kneeNode,
        device: opts.device,
        side: opts.side,
        lane,
        group: spec.group ?? 0,
        componentId: def.id,
        portId: spec.id,
      };
      ports.push(port);
      portByTerminalNode.set(terminalNode, port);
    }

    

    if (opts.connectToRail && ports.length > 0) {
      const midPort = ports[Math.floor(ports.length / 2)];
      const midPos = nodes[midPort.terminalNode].position;
      const targetIds =
        opts.railTargets ?? (isVertical ? hRailNodes.flat() : vRailNodes.flat());
      const railNode = nearestNodeFrom(targetIds, midPos[0], midPos[1]);
      const railPos = nodes[railNode].position;

      // Manhattan: one knee so both segments are axis-aligned.
      // Vertical sides target horizontal rails → knee shares terminal.x and rail.y
      // Horizontal sides target vertical rails → knee shares rail.x and terminal.y
      // Surface knee can reuse the x/y dedup map; inner layers need fresh nodes.
      const kneeNode =
        layer === 0
          ? getOrCreateNode(
              isVertical ? midPos[0] : railPos[0],
              isVertical ? railPos[1] : midPos[1]
            )
          : addNode(
              isVertical ? midPos[0] : railPos[0],
              isVertical ? railPos[1] : midPos[1],
              layer
            );

      addEdge(midPort.terminalNode, kneeNode);
      addEdge(kneeNode, railNode);
      if (layer > 0) {
        layerEdges[layer].push(edges[edges.length - 1], edges[edges.length - 2]);
      }
    }

    return ports;
  };

  // Route chips — pin placement comes from each component's PortSpecs.
  // Each chip is registered as a component immediately after its ports route.
  const chipDefs = COMPONENT_DEFS.filter((d) => d.kind === "chip");
  const toResolved = (p: DevicePort): ResolvedComponent["ports"][number] => ({
    spec: COMPONENT_DEFS.find((d) => d.id === p.componentId)!.ports.find((s) => s.id === p.portId)!,
    terminalNode: p.terminalNode,
    outwardNode: p.outwardNode,
    device: p.device,
    side: p.side,
    lane: p.lane,
    group: p.group,
  });

  // Route surface chips now; inner-layer chips wait until their layer's rail
  // replication exists (see below).
  const routeChip = (def: CircuitComponent, chipIndex: number, railTargets?: number[]) => {
    const devicePorts: DevicePort[] = [];
    (["top", "bottom", "left", "right"] as const).forEach((side) => {
      if (!def.ports.some((p) => p.side === side)) return;
      const ports = routeLaneFan({
        def,
        device: chipIndex,
        side,
        layer: def.layer ?? 0,
        railTargets,
        shoulderLen: 0.28,
        bandCenter:
          side === "top" || side === "bottom"
            ? (def.center ?? [0, 0])[0]
            : (def.center ?? [0, 0])[1],
        bandSpacing: 0.05,
        bandDir: side === "top" || side === "right" ? 1 : -1,
        connectToRail: true,
      });
      devicePorts.push(...ports);
    });
    components.push({
      def,
      device: chipIndex,
      ports: devicePorts.map(toResolved),
      layer: def.layer ?? 0,
    });
  };

  const chipIndexByDef = new Map(chipDefs.map((d, i) => [d, i]));
  chipDefs.forEach((def) => {
    if ((def.layer ?? 0) === 0) routeChip(def, chipIndexByDef.get(def)!);
  });

  // Route mux lanes (6 lanes per connection, fanned back to partner chips)
  const muxDef = COMPONENT_DEFS.find((d) => d.kind === "mux")!;
  const muxPorts: DevicePort[] = [];
  MUX_CONNECTIONS.forEach(({ chipIndex, chipSide, muxSide, group, bandDir, laneCount }) => {
    const chip = CHIP_DEFS[chipIndex];
    const [cx, cy] = chip.center;
    const [width, height] = chip.size;
    const chipEdgeX = cx + (chipSide === "right" ? width / 2 : -width / 2);
    const muxEdgeX = MUX_LAYOUT.center[0] + (muxSide === "left" ? -1 : 1) * (MUX_LAYOUT.size[0] / 2);

    // Create lanes from chip edge to mux edge
    for (let lane = 0; lane < laneCount; lane++) {
      const t = (lane + 1) / (laneCount + 1);
      const pinY = cy - height / 2 + t * height;
      const muxY = MUX_LAYOUT.center[1] + bandDir * (0.13 + lane * 0.035);

      const pinNode = addNode(chipEdgeX, pinY);
      const shoulderNode = addNode(chipEdgeX + (chipSide === "right" ? 0.3 : -0.3), pinY);
      const elbowNode = addNode(muxEdgeX + (muxSide === "left" ? 0.42 : -0.42), muxY);
      const terminalNode = addNode(muxEdgeX, muxY);

      const kneeNode = addNode(muxEdgeX + (muxSide === "left" ? 0.42 : -0.42), pinY);
      addEdge(pinNode, shoulderNode);
      addEdge(shoulderNode, kneeNode);   // horizontal
      addEdge(kneeNode, elbowNode);      // vertical
      addEdge(elbowNode, terminalNode);  // horizontal

      const port: DevicePort = {
        terminalNode,
        outwardNode: elbowNode,
        device: MUX_DEVICE,
        side: muxSide,
        lane,
        group,
        componentId: muxDef.id,
        portId: `mux-g${group}-l${lane}`,
      };
      muxPorts.push(port);
      portByTerminalNode.set(terminalNode, port);
    }
  });
  components.push({ def: muxDef, device: MUX_DEVICE, ports: muxPorts.map(toResolved), layer: 0 });

  // Scatter passive components on rail nodes
  Array.from(railNodeIds).forEach((id, i) => {
    const r = rng(id * 13.7 + i);
    if (r > 0.94) nodes[id].type = "capacitor";
    else if (r > 0.9) nodes[id].type = "transistor";
  });

  // Rail-end devices: single io port anchored to the rail terminal node.
  const railDeviceNodes = {
    outlet: hRailNodes[0][0],
    display: hRailNodes[0][hRailNodes[0].length - 1],
    input: hRailNodes[1][0],
    command: hRailNodes[1][hRailNodes[1].length - 1],
  };

  (["outlet", "display", "input", "command"] as const).forEach((kind) => {
    const def = COMPONENT_DEFS.find((d) => d.kind === kind)!;
    components.push({
      def,
      device: PASSIVE_DEVICE,
      node: railDeviceNodes[kind],
      layer: 0,
      ports: [
        {
          spec: def.ports[0],
          terminalNode: railDeviceNodes[kind],
          device: PASSIVE_DEVICE,
          side: def.ports[0].side,
          lane: 0,
          group: 0,
        },
      ],
    });
  });

  // Collect vias: nodes that form a corner (bend) or terminate a trace
  const isStraightThrough = (node: CircuitNode): boolean => {
    if (node.neighbors.length !== 2) return false;
    const [nx, ny] = node.position;
    const pa = nodes[node.neighbors[0]].position;
    const pb = nodes[node.neighbors[1]].position;
    const v1x = pa[0] - nx, v1y = pa[1] - ny;
    const v2x = pb[0] - nx, v2y = pb[1] - ny;
    const cross = v1x * v2y - v1y * v2x;
    const dot = v1x * v2x + v1y * v2y;
    // Collinear and pointing in opposite directions = straight-through trace
    return Math.abs(cross) < 1e-6 && dot < 0;
  };

  nodes.forEach((node) => {
    const isTerminal = node.neighbors.length === 1;
    const isBend = node.neighbors.length === 2 && !isStraightThrough(node);
    if (isTerminal || isBend) vias.push(node.id);
  });

  // ── Inner crystal layers ───────────────────────────────────────────────
  // Each layer gets its own node space (never aliased to top ids, so vertical
  // via edges have real length). Rails are fully replicated so every layer
  // forms loops; the seeded subset adds interior variety.
  const layerRailNodeIds: number[][] = Array.from({ length: LAYER_COUNT }, () => []);

  for (let layer = 1; layer < LAYER_COUNT; layer++) {
    const z = -layer * LAYER_SPACING;
    const lmap = new Map<number, number>(); // top node id → layer node id

    const layerNodeFor = (topId: number): number => {
      const existing = lmap.get(topId);
      if (existing !== undefined) return existing;
      const p = nodes[topId].position;
      const id = addNode(p[0], p[1], layer);
      lmap.set(topId, id);
      layerNodes[layer].push(id);
      return id;
    };

    // 1. Rails replicated in full → guaranteed loops on every layer
    const railSets: number[][] = [...hRailNodes, ...vRailNodes];
    railSets.forEach((rail) => {
      const mapped = rail.map((id) => layerNodeFor(id));
      layerRailNodeIds[layer].push(...mapped);
      for (let i = 0; i < mapped.length - 1; i++) {
        const before = edges.length;
        addEdge(mapped[i], mapped[i + 1]);
        if (edges.length > before) layerEdges[layer].push(edges[edges.length - 1]);
      }
    });

    // 2. Seeded subset of the remaining top edges → interior variety
    const railIdSet = new Set(railSets.flat());
    const topEdges = edges.filter(
      (e) => nodes[e.from].layer === 0 && nodes[e.to].layer === 0
    );
    topEdges.forEach((e) => {
      if (railIdSet.has(e.from) && railIdSet.has(e.to)) return; // rails already done
      if (!isLayerEdge(layer, e.from, e.to)) return;
      const a = layerNodeFor(e.from);
      const b = layerNodeFor(e.to);
      const before = edges.length;
      addEdge(a, b);
      if (edges.length > before) layerEdges[layer].push(edges[edges.length - 1]);
    });

    void z;
  }

  // 3. Via connectors: vertical ramps from the surface into the layers.
  //    Every via with viaDepth > 0 gets a link, so sparks can always dive
  //    and always climb back (the edge is bidirectional in `neighbors`).
  vias.forEach((viaId) => {
    const depth = viaDepth(viaId);
    if (depth === 0) return;
    const p = nodes[viaId].position;
    const bottom = addNode(p[0], p[1], depth);
    layerNodes[depth].push(bottom);
    addEdge(viaId, bottom);
    viaLinks.push({ top: viaId, bottom });
  });

  // Route inner-layer chips against their own layer's replicated rails —
  // sparks dive down a via shaft, ride the inner rail, and enter the package.
  chipDefs.forEach((def) => {
    const layer = def.layer ?? 0;
    if (layer === 0) return;
    routeChip(def, chipIndexByDef.get(def)!, layerRailNodeIds[layer]);
  });

  // Inner passive mounts: one deterministic rail node per listed layer.
  (["capacitor", "transistor"] as const).forEach((kind) => {
    const def = COMPONENT_DEFS.find((d) => d.kind === kind)!;
    def.innerMounts?.forEach((layer) => {
      const rails = layerRailNodeIds[layer];
      if (!rails || rails.length === 0) return;
      const id = rails[Math.floor(rng(layer * 71.3 + (kind === "capacitor" ? 3.7 : 9.1)) * rails.length)];
      nodes[id].type = kind;
    });
  });

  // Passives: inline on a rail node — both declared ports resolve to it.
  // Runs after inner mounts so every typed node (any layer) gets an instance.
  nodes.forEach((node) => {
    if (node.type !== "capacitor" && node.type !== "transistor") return;
    const def = COMPONENT_DEFS.find((d) => d.kind === node.type)!;
    components.push({
      def,
      device: PASSIVE_DEVICE,
      node: node.id,
      layer: node.layer,
      ports: def.ports.map((spec) => ({
        spec,
        terminalNode: node.id,
        device: PASSIVE_DEVICE,
        side: spec.side,
        lane: 0,
        group: 0,
      })),
    });
  });

  return {
    nodes,
    edges,
    vias,
    viaLinks,
    layerNodes,
    layerEdges,
    portByTerminalNode,
    components,
  };
}

// ── Public API ─────────────────────────────────────────────────────────────

let cached: Circuit | null = null;

export function getCircuit(): Circuit {
  if (!cached) cached = buildCircuit();
  return cached;
}

// For HMR or testing: reset the cached circuit
export function resetCircuit(): void {
  cached = null;
}
