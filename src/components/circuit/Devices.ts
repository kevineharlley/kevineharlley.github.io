// ── Board device model ─────────────────────────────────────────────────────
// Single source of truth for every device on the board: chips, the mux,
// rail-end devices, and passives. One Component class — kinds are data, not
// subclasses. Each instance owns its behavior members (structurally matching
// ComponentBehavior) and its own animation state (anim), so meshes read
// their instance directly and no parallel SimRefs structure exists.
// Pure TS, no React/Three runtime — safe for SSR.

import * as THREE from "three";
import type {
  ComponentBehavior,
  ConnectionSpec,
  PortRole,
  PortSide,
  SparkEffect,
  SparkKind,
} from "./types";
import { MUX_DEVICE, PASSIVE_DEVICE } from "./types";

// ── Theme palette ──────────────────────────────────────────────────────────
export const PALETTE = {
  primary: new THREE.Color("#f8ab1c"),
  secondary: new THREE.Color("#8c2cfb"),
  tertiary: new THREE.Color("#17c94b"),
  quarternary: new THREE.Color("#2be8c9"),
  quinary: new THREE.Color("#ff005d"),
};

/** Palette key for per-component coloring. */
export type AccentKey = keyof typeof PALETTE;

const PALETTE_DEFAULTS: Record<AccentKey, string> = {
  primary: "#f8ab1c",
  secondary: "#8c2cfb",
  tertiary: "#17c94b",
  quarternary: "#2be8c9",
  quinary: "#ff005d",
};

export const CSS_PALETTE_VARS: Record<AccentKey, string> = {
  primary: "--color-primary",
  secondary: "--color-secondary",
  tertiary: "--color-tertiary",
  quarternary: "--color-quarternary",
  quinary: "--color-quinary",
};

export function applyPalette(hex: Partial<Record<AccentKey, string>>): void {
  (Object.keys(PALETTE) as AccentKey[]).forEach((k) => PALETTE[k].set(hex[k] ?? PALETTE_DEFAULTS[k]));
}

/** Synchronizes Three.js PALETTE directly from document computed CSS variables. */
export function syncPaletteFromCSS(): void {
  if (typeof window === "undefined") return;
  const styles = getComputedStyle(document.documentElement);
  const colors: Partial<Record<AccentKey, string>> = {};

  (Object.keys(CSS_PALETTE_VARS) as AccentKey[]).forEach((key) => {
    const val = styles.getPropertyValue(CSS_PALETTE_VARS[key]).trim();
    if (val) {
      colors[key] = val;
    }
  });

  applyPalette(colors);
}

// ── Spark effects (pure data) ──────────────────────────────────────────────
export const COMPONENT_EFFECTS: Record<"capacitor" | "transistor" | "chipPin", SparkEffect> = {
  capacitor: { color: PALETTE.secondary, energyOp: (e) => Math.min(1, e + 0.35), boostFrames: 20 },
  transistor: { color: PALETTE.tertiary, energyOp: (e) => Math.min(1, e * 1.5), boostFrames: 20 },
  chipPin: {
    color: PALETTE.primary,
    energyOp: (e) => Math.min(1, e + 0.1),
    boostFrames: 12,
    dwellSeconds: 0.35,
  },
};

// ── Port ───────────────────────────────────────────────────────────────────
// One object serves as both the declared spec (id/side/t/role/group) and the
// resolved connection point (terminalNode/outwardNode filled by the builder).

export class Port {
  readonly id: string;
  readonly side: PortSide;
  /** 0..1 position along the side's port spread (0.5 = centered) */
  readonly t: number;
  readonly role: PortRole;
  /** mux lane group; everything else uses 0 */
  readonly group: number;
  /** node ON the device edge — filled by buildCircuit */
  terminalNode = -1;
  /** first node OFF the device — filled by buildCircuit */
  outwardNode?: number;
  /** index within its fan-out — filled by buildCircuit */
  lane = 0;
  /** owning device: chip index, MUX_DEVICE, or PASSIVE_DEVICE — filled by buildCircuit */
  device = -2;

  constructor(id: string, side: PortSide, t: number, role: PortRole, group = 0) {
    this.id = id;
    this.side = side;
    this.t = t;
    this.role = role;
    this.group = group;
  }
}

/** Evenly-spaced ports along one side of a packaged device. */
function spreadPorts(
  prefix: string,
  side: PortSide,
  count: number,
  group = 0,
  tFn?: (lane: number) => number
): Port[] {
  return Array.from({ length: count }, (_, lane) => {
    const t = tFn ? tFn(lane) : (lane + 1) / (count + 1);
    return new Port(`${prefix}-${side}${lane}`, side, t, "io", group);
  });
}

// ── Component kinds ────────────────────────────────────────────────────────

export type ComponentKind =
  | "chip"
  | "mux"
  | "outlet"
  | "display"
  | "input"
  | "command"
  | "capacitor"
  | "transistor";

// ── Animation state ────────────────────────────────────────────────────────
// Every component owns one; meshes read their instance's anim in useFrame.

export interface AnimState {
  flashUntil: number;
  flashColor: THREE.Color;
  glow: number;
  pulse: number;
  count: number;
  /** mux: per-side lane glow (0 = left, 1 = right) */
  laneFlash: [number, number];
}

function createAnimState(): AnimState {
  return { flashUntil: 0, flashColor: new THREE.Color(PALETTE.primary), glow: 0, pulse: 0, count: 0, laneFlash: [0, 0], };
}

// ── Chip layout data ───────────────────────────────────────────────────────

export interface ChipLayout {
  center: [number, number];
  size: [number, number];
  pins: { top: number; bottom: number; left: number; right: number };
  layer: number;
  accent?: AccentKey;
}

export const CHIP_LAYOUTS: ChipLayout[] = [
  { center: [0, 1.7], size: [2.1, 1.2], pins: { top: 6, bottom: 6, left: 3, right: 3 }, layer: 0, accent: "quarternary"  },
  { center: [0, -1.7], size: [1.4, 0.9], pins: { top: 4, bottom: 4, left: 2, right: 2 }, layer: 6 , accent: "quarternary" },
  { center: [-4.5, 1.7], size: [1.2, 0.8], pins: { top: 4, bottom: 0, left: 2, right: 3 }, layer: 1, accent: "secondary" },
  { center: [4.5, 1.7], size: [1.2, 0.8], pins: { top: 4, bottom: 0, left: 3, right: 2 }, layer: 1, accent: "secondary" },
  { center: [-4.5, -1.7], size: [1.2, 0.8], pins: { top: 0, bottom: 4, left: 2, right: 3 }, layer: 3, accent: "primary" },
  { center: [4.5, -1.7], size: [1.2, 0.8], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 3, accent: "primary" },

  { center: [-2.25, -0.7], size: [0.8, 0.6], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 2, accent: "primary" },
  { center: [-2.25, 0.7], size: [0.8, 0.6], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 2, accent: "tertiary" },
  { center: [2.25, -0.7], size: [0.8, 0.6], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 4, accent: "primary" },
  { center: [2.25, 0.7], size: [0.8, 0.6], pins: { top: 0, bottom: 4, left: 3, right: 2 }, layer: 4, accent: "tertiary" },

  // Inner crystal layers — one small package per layer, placed in the open
  // quadrants clear of the rails (x ∈ {-6,-3,0,3,6}, y = ±3.8).
  { center: [-1.9, -2.5], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 1, accent: "secondary" },
  { center: [1.9, 2.5], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 2, accent: "primary" },
  { center: [1.9, -2.5], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 3, accent: "secondary" },
  { center: [-1.9, 2.5], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 4, accent: "primary" },
  { center: [-4.5, 0], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 5, accent: "secondary" },
  { center: [4.5, 0], size: [1.0, 0.7], pins: { top: 2, bottom: 2, left: 1, right: 1 }, layer: 6, accent: "secondary" },
];

// ── Mux layout & routing data ──────────────────────────────────────────────

export const MUX_CENTER: [number, number] = [0, 0];
export const MUX_SIZE: [number, number] = [1.45, 0.72];

// Lane band geometry — the single source both port generation (muxPorts) and
// the router (circuitLayout) read, so declared and routed positions never drift.
export const MUX_BAND_START = 0.13;
export const MUX_BAND_STEP = 0.035;

export const MUX_THRESHOLD = 6;
const MUX_TIMEOUT_SECONDS = 7;
const MUX_MINIMUM_TIMEOUT_COUNT = 2;

// Mux lane t positions derive from the same band constants the router uses.
function muxPorts(conns: ConnectionSpec[]): Port[] {
  const [, cy] = MUX_CENTER;
  const [, h] = MUX_SIZE;
  const ports: Port[] = [];
  conns.forEach((conn) => {
    if (conn.target.to !== "component") return;
    const group = conn.group ?? 0;
    const side = conn.side ?? "left";
    const laneCount = conn.laneCount ?? 0;
    for (let lane = 0; lane < laneCount; lane++) {
      const y = cy + (conn.bandDir ?? 1) * (MUX_BAND_START + lane * MUX_BAND_STEP);
      const t = (y - (cy - h / 2)) / h;
      ports.push(new Port(`mux-g${group}-l${lane}`, side, t, "io", group));
    }
  });
  return ports;
}

// ── Component ──────────────────────────────────────────────────────────────

interface ComponentOptions {
  id: string;
  kind: ComponentKind;
  center?: [number, number];
  size?: [number, number];
  layer?: number;
  portSpread?: number;
  ports?: Port[];
  connections?: ConnectionSpec[];
  innerMounts?: number[];
  accent?: AccentKey;
}

export class Component implements ComponentBehavior {
  readonly id: string;
  readonly kind: ComponentKind;
  readonly center?: [number, number];
  readonly size?: [number, number];
  /** crystal layer the instance is mounted on (0 = surface); builder may move passives to inner layers */
  layer: number;
  readonly portSpread?: number;
  readonly accent?: AccentKey;
  ports: Port[];
  /** declared connections — the single source of all board routing */
  readonly connections: ConnectionSpec[];
  readonly innerMounts?: number[];
  /** passives: stable instance key so each mount point is a distinct registry entry */
  instanceKey = 0;

  /** chip index, MUX_DEVICE, or PASSIVE_DEVICE — filled by buildCircuit */
  device = PASSIVE_DEVICE;
  /** mount node for rail devices / passives — filled by buildCircuit */
  node?: number;
  /** world position of the mount node — filled by buildCircuit */
  nodePosition?: [number, number, number];

  readonly anim: AnimState = createAnimState();

  // ── ComponentBehavior members (assigned per kind in the constructor) ──
  effect?: SparkEffect;
  spawner?: { intervalSeconds: number; kind: SparkKind; energy: number };
  onArrive?: ComponentBehavior["onArrive"];
  onUpdate?: ComponentBehavior["onUpdate"];
  onClick?: ComponentBehavior["onClick"];

  // ── Mux state ──
  private muxInputs: { color: THREE.Color; energy: number; portIndex: number }[] = [];
  private muxElapsed = 0;
  private muxEmissionNonce = 0;

  constructor(opts: ComponentOptions) {
    this.id = opts.id;
    this.kind = opts.kind;
    this.center = opts.center;
    this.size = opts.size;
    this.layer = opts.layer ?? 0;
    this.portSpread = opts.portSpread;
    this.accent = opts.accent;
    this.ports = opts.ports ?? [];
    this.connections = opts.connections ?? [];
    this.innerMounts = opts.innerMounts;
    this.assignBehavior();
  }

  /** Trigger the package flash animation. */
  flash(color: THREE.Color): void {
    this.anim.flashUntil = Date.now() + 400;
    this.anim.flashColor.copy(color);
  }

  /** Nodes this instance registers behaviors against. */
  behaviorBindings(): number[] {
    if (this.kind === "chip" || this.kind === "mux") {
      return this.ports.map((p) => p.terminalNode);
    }
    return this.node !== undefined ? [this.node] : [];
  }

  /** Create a fresh per-mount passive instance with its own anim state. */
  cloneForMount(key: number): Component {
    const c = new Component({
      id: this.id,
      kind: this.kind,
      ports: this.ports.map(
        (p) => new Port(p.id, p.side, p.t, p.role, p.group)
      ),
      innerMounts: this.innerMounts,
    });
    c.instanceKey = key;
    return c;
  }

  private assignBehavior(): void {
    switch (this.kind) {
      case "chip":
        this.effect = COMPONENT_EFFECTS.chipPin;
        break;
      case "capacitor":
        this.effect = COMPONENT_EFFECTS.capacitor;
        break;
      case "transistor":
        this.effect = COMPONENT_EFFECTS.transistor;
        break;
      case "display":
        this.onArrive = ({ slot, spawn }) => {
          if (slot.kind !== "spark") return "continue";
          this.anim.glow = 1;
          spawn("return", slot.currentNode, 0.2);
          return "consumed";
        };
        break;
      case "input":
        this.spawner = { intervalSeconds: 3.4, kind: "spark", energy: 0.3 };
        break;
      case "command":
        this.spawner = { intervalSeconds: 5.5, kind: "command", energy: 0.6 };
        break;
      case "outlet":
        this.onClick = (simRefs) => simRefs.togglePaused();
        this.spawner = { intervalSeconds: Infinity, kind: "spark", energy: 0.3 };
        break;
      case "mux":
        this.onArrive = (ctx) => this.muxArrive(ctx);
        this.onUpdate = (delta, ctx) => this.muxUpdate(delta, ctx);
        this.onClick = () => this.muxReset();
        break;
    }
  }

  // ── Mux behavior ─────────────────────────────────────────────────────────

  private muxEmit(ctx: Parameters<NonNullable<ComponentBehavior["onUpdate"]>>[1]): void {
    const inputs = this.muxInputs;
    
    if (inputs.length === 0) return;

    const ports = this.ports;
    const lastPort = ports[inputs[inputs.length - 1].portIndex];
    let outputs = ports.filter((p) => p.group !== lastPort.group);
    if (outputs.length === 0) outputs = ports;

    this.muxEmissionNonce += 1;
    const output =
      outputs[Math.floor(((this.muxEmissionNonce * 71.3 + inputs.length) % 1) * outputs.length)];

    const mergedColor = inputs
      .reduce((c, i) => c.add(i.color), new THREE.Color(0, 0, 0))
      .multiplyScalar(1 / inputs.length);
    const mergedEnergy = Math.min(1, inputs.reduce((t, i) => t + i.energy, 0) / inputs.length + 0.2);

    ctx.spawn("multiplexed", output.terminalNode, mergedEnergy);
    this.anim.laneFlash[output.side === "left" ? 0 : 1] = 1;

    inputs.length = 0;
    this.muxElapsed = 0;
    this.anim.count = 0;
    this.anim.pulse = 1;
  }

  private muxArrive(ctx: Parameters<NonNullable<ComponentBehavior["onArrive"]>>[0]): "consumed" | "continue" {
    const { slot } = ctx;
    if (slot.kind === "command" || slot.kind === "multiplexed") return "continue";

    const portIndex = this.ports.findIndex((p) => p.terminalNode === slot.currentNode);
    if (portIndex === -1) return "continue";

    this.muxInputs.push({ color: slot.color.clone(), energy: slot.energy, portIndex });

    this.anim.count = Math.min(MUX_THRESHOLD, this.muxInputs.length);
    this.anim.pulse = 0.35;
    this.anim.laneFlash[this.ports[portIndex].side === "left" ? 0 : 1] = 1;

    if (this.muxInputs.length >= MUX_THRESHOLD) {
      this.muxEmit(ctx);
    }
    return "consumed";
  }

  private muxUpdate(delta: number, ctx: Parameters<NonNullable<ComponentBehavior["onUpdate"]>>[1]): void {
    if (this.muxInputs.length === 0) return;
    this.muxElapsed += delta;
    if (this.muxElapsed >= MUX_TIMEOUT_SECONDS && this.muxInputs.length >= MUX_MINIMUM_TIMEOUT_COUNT) {
      this.muxEmit(ctx);
    }
  }

  private muxReset(): void {
    this.muxInputs.length = 0;
    this.muxElapsed = 0;
    this.anim.count = 0;
  }
}

// ── Mesh data ──────────────────────────────────────────────────────────────
// Geometry + material parameters per kind. One central place to reshape any
// component; ComponentMesh renders from these specs.

export type MeshGeometry =
  | { type: "box"; args: [number, number, number] }
  | { type: "cylinder"; args: [number, number, number, number] }
  | { type: "sphere"; args: [number, number, number] }
  | { type: "chip"; layer: number }
  | { type: "mux" };

export interface MeshSpec {
  geometry: MeshGeometry;
  /** which palette key the emissive/glow uses */
  accent: AccentKey;
  /** group position offset from the mount node */
  offset: [number, number, number];
  /** animation channel this mesh reads from anim */
  animChannel: "flash" | "glow" | "pulse-count" | "pause-pulse-sin" | "pause-pulse-cos" | "pause-fade" | "none";
}

export const MESH_SPECS: Record<ComponentKind, MeshSpec> = {
  chip: { geometry: { type: "chip", layer: 0 }, accent: "primary", offset: [0, 0, 0], animChannel: "flash" },
  mux: { geometry: { type: "mux" }, accent: "secondary", offset: [0, 0, 0], animChannel: "pulse-count" },
  outlet: { geometry: { type: "box", args: [0.42, 0.42, 0.14] }, accent: "primary", offset: [0.35, 0, 0], animChannel: "pause-fade" },
  display: { geometry: { type: "box", args: [0.5, 0.36, 0.06] }, accent: "tertiary", offset: [-0.32, 0, 0], animChannel: "glow" },
  input: { geometry: { type: "cylinder", args: [0.16, 0.16, 0.16, 12] }, accent: "secondary", offset: [0.32, 0, 0], animChannel: "pause-pulse-sin" },
  command: { geometry: { type: "box", args: [0.24, 0.24, 0.16] }, accent: "tertiary", offset: [-0.32, 0, 0], animChannel: "pause-pulse-cos" },
  capacitor: { geometry: { type: "cylinder", args: [0.035, 0.045, 0.18, 12] }, accent: "secondary", offset: [0, 0, 0.09], animChannel: "none" },
  transistor: { geometry: { type: "sphere", args: [0.05, 12, 8] }, accent: "tertiary", offset: [0, 0, 0.07], animChannel: "none" },
};

// ── Board registry ─────────────────────────────────────────────────────────
// The single central list the builder consumes.

const SIDES = ["top", "bottom", "left", "right"] as const;

export function createBoard(): Component[] {
  const components: Component[] = [];

  CHIP_LAYOUTS.forEach((chip, i) => {
    const ports: Port[] = [];
    SIDES.forEach((side) => {
      ports.push(...spreadPorts(`chip${i}`, side, chip.pins[side]));
    });
    // Every pinned side declares a fan out to the nearest rail.
    const connections: ConnectionSpec[] = SIDES.filter((side) => chip.pins[side] > 0).map(
      (side): ConnectionSpec => ({
        target: { to: "rail" },
        side,
        bandDir: side === "top" || side === "right" ? 1 : -1,
      })
    );
    components.push(
      new Component({
        id: `chip-${i}`,
        kind: "chip",
        center: chip.center,
        size: chip.size,
        layer: chip.layer,
        portSpread: 0.8,
        accent: chip.accent,
        ports,
        connections,
      })
    );
  });

  // Mux: four lane groups fanned directly to the partner chips' inner edges.
  // Partners are referenced by id — no coupling to CHIP_LAYOUTS array order.
  const muxConnections: ConnectionSpec[] = [
    { target: { to: "component", id: "chip-2", side: "right" }, side: "left", group: 0, bandDir: 1, laneCount: 6 },
    { target: { to: "component", id: "chip-4", side: "right" }, side: "left", group: 1, bandDir: -1, laneCount: 6 },
    { target: { to: "component", id: "chip-3", side: "left" }, side: "right", group: 2, bandDir: 1, laneCount: 6 },
    { target: { to: "component", id: "chip-5", side: "left" }, side: "right", group: 3, bandDir: -1, laneCount: 6 },
  ];
  components.push(
    new Component({
      id: "mux",
      kind: "mux",
      center: MUX_CENTER,
      size: MUX_SIZE,
      ports: muxPorts(muxConnections),
      connections: muxConnections,
    })
  );

  // Rail-end devices: each declares its rail anchor as a connection.
  components.push(new Component({ id: "outlet", kind: "outlet", ports: [new Port("rail", "left", 0.5, "io")], connections: [{ target: { to: "railEnd", rail: "top", end: "start" } }] }));
  components.push(new Component({ id: "display", kind: "display", ports: [new Port("rail", "right", 0.5, "io")], connections: [{ target: { to: "railEnd", rail: "top", end: "end" } }] }));
  components.push(new Component({ id: "input", kind: "input", ports: [new Port("rail", "left", 0.5, "io")], connections: [{ target: { to: "railEnd", rail: "bottom", end: "start" } }] }));
  components.push(new Component({ id: "command", kind: "command", ports: [new Port("rail", "right", 0.5, "io")], connections: [{ target: { to: "railEnd", rail: "bottom", end: "end" } }] }));

  const inlinePorts = () => [new Port("in", "left", 0.5, "in"), new Port("out", "right", 0.5, "out")];
  components.push(new Component({ id: "capacitor", kind: "capacitor", ports: inlinePorts(), innerMounts: [2, 4, 6] }));
  components.push(new Component({ id: "transistor", kind: "transistor", ports: inlinePorts(), innerMounts: [1, 3, 5] }));

  return components;
}

// Factory entry point used by BoardRenderer/BoardBuilder.
export class DeviceFactory {
  static createBoardSet(): Component[] {
    return createBoard();
  }
}
