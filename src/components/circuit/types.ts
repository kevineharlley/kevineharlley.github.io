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
export interface SimContext {
  paused: { value: boolean };
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

// Where a connection fan terminates.
//  - "rail":      converge to the nearest board rail (chips)
//  - "component": fan directly to a partner component's edge (mux)
//  - "railEnd":   anchor a rail-end device to one end of a horizontal rail
export type ConnectionTarget =
  | { to: "rail" }
  | { to: "component"; id: string; side: PortSide }
  | { to: "railEnd"; rail: "top" | "bottom"; end: "start" | "end" };

// Declarative routing metadata. Every component declares its connections in
// createBoard() (devices.ts); the single dispatcher in circuitLayout.ts
// executes them — no per-kind routing blocks. Fields are interpreted per
// target: side/bandDir/shoulderLen/bandSpacing for "rail"; side/group/
// laneCount/bandDir/bandStart/bandStep/shoulderLen/elbowOffset for "component";
// none beyond target for "railEnd".
export interface ConnectionSpec {
  target: ConnectionTarget;
  /** side of the OWNING component the fan leaves from */
  side?: PortSide;
  /** mux lane group — drives Port.group for mux behavior */
  group?: number;
  bandDir?: 1 | -1;
  laneCount?: number;
  shoulderLen?: number;
  elbowOffset?: number;
  bandStart?: number;
  bandStep?: number;
  bandSpacing?: number;
}

export const MUX_DEVICE = -1;
/** Sentinel for components that packets never get absorbed into (passives, rail devices). */
export const PASSIVE_DEVICE = -2;
