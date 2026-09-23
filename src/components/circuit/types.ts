// ── Shared simulation types ────────────────────────────────────────────────
// Pure types only — no React, no Three.js runtime dependencies. Both
// ChipComponents (behavior definitions) and SparkField (execution) import
// from here to avoid circular dependencies.

import type * as THREE from "three";

export type Vec3 = [number, number, number];

export type SparkKind = "spark" | "command" | "return" | "multiplexed";

export interface SparkEffect {
  color: THREE.Color;
  energyOp: (energy: number) => number;
  boostFrames: number;
  dwellSeconds?: number;
}

// The mutable packet state owned by SparkField. Passed to behaviors on arrival.
export interface SparkSlot {
  active: boolean;
  kind: SparkKind;
  currentNode: number;
  nextNode: number;
  progress: number;
  energy: number;
  boostFrames: number;
  history: number[];
  flicker: number;
  color: THREE.Color;
  routeNonce: number;
  absorbed?: { chipIndex: number; entryPin: number; remaining: number };
  /** seconds spent below the surface; teleports home if it exceeds the cap */
  deepTime?: number;
}

// Minimal interface for the shared sim state that behaviors need access to.
// The full SimRefs interface lives in ChipComponents to avoid cycles.
export interface SimContext {
  paused: { value: boolean };
  setDisplayGlow: (value: number) => void;
  flashChip: (chipIndex: number, color: THREE.Color) => void;
  setMuxCount: (value: number) => void;
  setMuxPulse: (value: number) => void;
  togglePaused: () => void;
}

// What SparkField hands to a behavior when it fires
export interface SparkContext {
  slot: SparkSlot;
  simRefs: SimContext;
  spawn: (kind: SparkKind, node: number, energy: number) => void;
}

// A component's behavioral contract. Implement only what the component needs.
export interface ComponentBehavior {
  // Passive transform applied when a spark passes through (capacitor, transistor)
  effect?: SparkEffect;

  // Arrival handler. Return "consumed" to retire the spark, "continue" to keep routing.
  onArrive?: (ctx: SparkContext) => "consumed" | "continue";

  // Periodic packet source (input, command, outlet seed)
  spawner?: { intervalSeconds: number; kind: SparkKind; energy: number };

  // Per-frame tick for stateful behaviors (mux timeout, etc.)
  onUpdate?: (delta: number, ctx: Omit<SparkContext, "slot">) => void;

  // Click interaction
  onClick?: (simRefs: SimContext) => void;
}

// ── Declarative component model ────────────────────────────────────────────

export type PortSide = "top" | "bottom" | "left" | "right";
export type PortRole = "in" | "out" | "io";

// A port as declared by a component definition. The circuit builder resolves
// specs into concrete graph nodes — the spec is the source of truth for where
// a port lives on the package edge.
export interface PortSpec {
  id: string;
  side: PortSide;
  /** 0..1 position along the side's port spread (0.5 = centered) */
  t: number;
  role: PortRole;
  /** mux lane group; everything else uses 0 or undefined */
  group?: number;
}

export type ComponentKind =
  | "chip"
  | "mux"
  | "outlet"
  | "display"
  | "input"
  | "command"
  | "capacitor"
  | "transistor";

// Mux-only routing metadata: how a lane group fans back out to a partner chip.
export interface MuxConnectionSpec {
  chipIndex: number;
  chipSide: PortSide;
  muxSide: PortSide;
  group: number;
  bandDir: 1 | -1;
  laneCount: number;
}

/**
 * Unified component definition: every device on the board — chips, the mux,
 * rail-end devices, and passives — is one of these.
 */
export interface CircuitComponent {
  id: string;
  kind: ComponentKind;
  center?: [number, number];
  size?: [number, number];
  /** crystal layer the device mounts on: 0 = surface, 1..N = inner layers */
  layer?: number;
  /** fraction of an edge the pin spread covers (packaged devices) */
  portSpread?: number;
  ports: PortSpec[];
  /** mux only: lane fan-out to partner chips */
  connections?: MuxConnectionSpec[];
  /** passives only: inner layers to also instantiate this type on */
  innerMounts?: number[];
}

// A PortSpec after the builder has placed it in the graph.
export interface ResolvedPort {
  spec: PortSpec;
  terminalNode: number;
  outwardNode?: number;
  device: number;      // chip index, MUX_DEVICE, or PASSIVE_DEVICE
  side: PortSide;
  lane: number;        // index within its fan-out
  group: number;       // mux lane group; everything else uses 0
}

// A component instance mounted on the board.
export interface ResolvedComponent {
  def: CircuitComponent;
  /** chip index or MUX_DEVICE for packaged devices; PASSIVE_DEVICE otherwise */
  device: number;
  ports: ResolvedPort[];
  /** node-mounted components (rail devices, passives) */
  node?: number;
  /** crystal layer the instance is mounted on (0 = surface) */
  layer: number;
}

// Unified port type: any node where a packet can enter or leave a device.
export interface DevicePort {
  terminalNode: number;  // node ON the device edge (chip pin or mux terminal)
  outwardNode: number;   // first node OFF the device
  device: number;        // chip index, or -1 for the mux
  side: PortSide;
  lane: number;          // index within its fan-out
  group: number;         // mux lane group; chips always use 0
  componentId: string;   // CircuitComponent id that owns this port
  portId: string;        // PortSpec id within the component
}

export const MUX_DEVICE = -1;
/** Sentinel for components that packets never get absorbed into (passives, rail devices). */
export const PASSIVE_DEVICE = -2;
