// ── Component registry ─────────────────────────────────────────────────────
// Single source of truth for every device on the board: chips, the mux,
// rail-end devices, and passives. PortSpecs are declarative — the circuit
// builder (circuitLayout) resolves them into graph nodes and edges.
// Pure data, no React/Three — safe for SSR.

import type {
  CircuitComponent,
  MuxConnectionSpec,
  PortSpec,
} from "./types";

// ── Physical layout data ───────────────────────────────────────────────────

export interface ChipDef {
  center: [number, number];
  size: [number, number];
  pins: { top: number; bottom: number; left: number; right: number };
  /** crystal layer the package mounts on: 0 = surface, 1..N = inner layers */
  layer: number;
}

export const CHIP_DEFS: ChipDef[] = [
  { center: [0, 1.7], size: [2.1, 1.2], pins: { top: 6, bottom: 6, left: 3, right: 3 }, layer: 0 },
  { center: [0, -1.7], size: [1.4, 0.9], pins: { top: 4, bottom: 4, left: 2, right: 2 }, layer: 0 },
  { center: [-4.5, 1.7], size: [1.2, 0.8], pins: { top: 4, bottom: 0, left: 2, right: 3 }, layer: 0 },
  { center: [4.5, 1.7], size: [1.2, 0.8], pins: { top: 4, bottom: 0, left: 3, right: 2 }, layer: 0 },
  { center: [-4.5, -1.7], size: [1.2, 0.8], pins: { top: 0, bottom: 4, left: 2, right: 3 }, layer: 0 },
  { center: [4.5, -1.7], size: [1.2, 0.8], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 0 },

  // new
  { center: [-2.25, -0.7], size: [0.8, 0.6], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 0 },
  { center: [-2.25, 0.7], size: [0.8, 0.6], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 0 },
  { center: [2.25, -0.7], size: [0.8, 0.6], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 0 },
  { center: [2.25, 0.7], size: [0.8, 0.6], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 0 },

  // Inner crystal layers — one small package per layer, placed in the open
  // quadrants clear of the rails (x ∈ {-6,-3,0,3,6}, y = ±3.8).
  { center: [-1.9, -2.5], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 1 },
  { center: [1.9, 2.5], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 2 },
  { center: [1.9, -2.5], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 3 },
  { center: [-1.9, 2.5], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 4 },
  { center: [-4.5, 0], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 5 },
  { center: [4.5, 0], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 6 },
];

export const MUX_LAYOUT = {
  center: [0, 0] as [number, number],
  size: [1.45, 0.72] as [number, number],
};

// How the mux lane groups fan back out to the partner chips.
export const MUX_CONNECTIONS: MuxConnectionSpec[] = [
  { chipIndex: 2, chipSide: "right", muxSide: "left", group: 0, bandDir: 1, laneCount: 6 },
  { chipIndex: 4, chipSide: "right", muxSide: "left", group: 1, bandDir: -1, laneCount: 6 },
  { chipIndex: 3, chipSide: "left", muxSide: "right", group: 2, bandDir: 1, laneCount: 6 },
  { chipIndex: 5, chipSide: "left", muxSide: "right", group: 3, bandDir: -1, laneCount: 6 },
];

// ── Port spec builders ─────────────────────────────────────────────────────

// Chip pins: evenly spread across the side's port-spread region.
function chipPortSpecs(chip: ChipDef, chipIndex: number): PortSpec[] {
  const specs: PortSpec[] = [];
  (["top", "bottom", "left", "right"] as const).forEach((side) => {
    const count = chip.pins[side];
    for (let lane = 0; lane < count; lane++) {
      specs.push({
        id: `chip${chipIndex}-${side}${lane}`,
        side,
        t: (lane + 1) / (count + 1),
        role: "io",
        group: 0,
      });
    }
  });
  return specs;
}

// Mux lanes: t is derived from the same band formula the router uses, so the
// declared position and the routed position can never drift apart.
function muxPortSpecs(): PortSpec[] {
  const specs: PortSpec[] = [];
  const [, h] = MUX_LAYOUT.size;
  const [, cy] = MUX_LAYOUT.center;
  MUX_CONNECTIONS.forEach((conn) => {
    for (let lane = 0; lane < conn.laneCount; lane++) {
      const y = cy + conn.bandDir * (0.13 + lane * 0.035);
      specs.push({
        id: `mux-g${conn.group}-l${lane}`,
        side: conn.muxSide,
        t: (y - (cy - h / 2)) / h,
        role: "io",
        group: conn.group,
      });
    }
  });
  return specs;
}

// Passives sit inline on a trace: both ports resolve to the mounted node.
const INLINE_PORTS: PortSpec[] = [
  { id: "in", side: "left", t: 0.5, role: "in" },
  { id: "out", side: "right", t: 0.5, role: "out" },
];

// ── The registry ───────────────────────────────────────────────────────────

export const COMPONENT_DEFS: CircuitComponent[] = [
  ...CHIP_DEFS.map(
    (chip, i): CircuitComponent => ({
      id: `chip-${i}`,
      kind: "chip",
      center: chip.center,
      size: chip.size,
      layer: chip.layer,
      portSpread: 0.8,
      ports: chipPortSpecs(chip, i),
    })
  ),
  {
    id: "mux",
    kind: "mux",
    center: MUX_LAYOUT.center,
    size: MUX_LAYOUT.size,
    ports: muxPortSpecs(),
    connections: MUX_CONNECTIONS,
  },
  // Rail-end devices: a single io port anchored to their rail terminal node.
  { id: "outlet", kind: "outlet", ports: [{ id: "rail", side: "left", t: 0.5, role: "io" }] },
  { id: "display", kind: "display", ports: [{ id: "rail", side: "right", t: 0.5, role: "io" }] },
  { id: "input", kind: "input", ports: [{ id: "rail", side: "left", t: 0.5, role: "io" }] },
  { id: "command", kind: "command", ports: [{ id: "rail", side: "right", t: 0.5, role: "io" }] },
  // Passive types — one def each, instantiated per scattered rail node on the
  // surface and once per listed inner layer.
  { id: "capacitor", kind: "capacitor", ports: INLINE_PORTS, innerMounts: [2, 4, 6] },
  { id: "transistor", kind: "transistor", ports: INLINE_PORTS, innerMounts: [1, 3, 5] },
];
