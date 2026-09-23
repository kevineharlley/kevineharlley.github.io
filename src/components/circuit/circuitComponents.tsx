"use client";

// ── Component registry: visuals + behavior contracts ───────────────────────
// Each device exports both its mesh and its ComponentBehavior. SparkField
// consumes the behaviors; BoardRenderer consumes the meshes.

import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { createContext, useContext, useMemo, useRef } from "react";
import * as THREE from "three";
import type {
  ComponentBehavior,
  SparkContext,
  SparkEffect,
} from "./types";
import { MUX_LAYOUT } from "./componentDefs";
import { LAYER_SPACING } from "./circuitLayout";

export type { Vec3 } from "./types";

// ── Theme palette ──────────────────────────────────────────────────────────
export const PALETTE = {
  secondary: new THREE.Color("#ffb830"),
  primary: new THREE.Color("#17c94b"),
  tertiary: new THREE.Color("#a855f7"),
};

// ── Shared mutable sim state ───────────────────────────────────────────────
export interface ChipFlash {
  until: number;
  color: THREE.Color;
}

export interface SimRefs {
  paused: { value: boolean };
  displayGlow: { value: number };
  chipFlash: (ChipFlash | undefined)[];
  muxCount: { value: number };
  muxPulse: { value: number };
  togglePaused: () => void;
  setDisplayGlow: (value: number) => void;
  decayDisplayGlow: (delta: number) => void;
  flashChip: (chipIndex: number, color: THREE.Color) => void;
  getChipFlash: (chipIndex: number) => ChipFlash | undefined;
  setMuxCount: (value: number) => void;
  setMuxPulse: (value: number) => void;
}

export function createSimulationRefs(chipCount = 0): SimRefs {
  const state: SimRefs = {
    paused: { value: false },
    displayGlow: { value: 0 },
    chipFlash: Array.from({ length: chipCount }, () => undefined),
    muxCount: { value: 0 },
    muxPulse: { value: 0 },
    togglePaused: () => {
      state.paused.value = !state.paused.value;
    },
    setDisplayGlow: (value: number) => {
      state.displayGlow.value = value;
    },
    decayDisplayGlow: (delta: number) => {
      state.displayGlow.value = Math.max(0, state.displayGlow.value - delta * 1.1);
    },
    flashChip: (chipIndex: number, color: THREE.Color) => {
      state.chipFlash[chipIndex] = { until: Date.now() + 400, color };
    },
    getChipFlash: (chipIndex: number) => state.chipFlash[chipIndex],
    setMuxCount: (value: number) => {
      state.muxCount.value = value;
    },
    setMuxPulse: (value: number) => {
      state.muxPulse.value = value;
    },
  };

  return state;
}

export const SimRefsContext = createContext<SimRefs | null>(null);

export function useSimRefs(): SimRefs {
  const ctx = useContext(SimRefsContext);
  if (!ctx) throw new Error("SimRefs context not available");
  return ctx;
}

// ── IC package layout data ─────────────────────────────────────────────────
export interface ChipDef {
  center: [number, number];
  size: [number, number];
  pins: { top: number; bottom: number; left: number; right: number };
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

// ── Behavior contracts ─────────────────────────────────────────────────────

export const capacitorBehavior: ComponentBehavior = {
  effect: COMPONENT_EFFECTS.capacitor,
};

export const transistorBehavior: ComponentBehavior = {
  effect: COMPONENT_EFFECTS.transistor,
};

export const chipPinBehavior: ComponentBehavior = {
  effect: COMPONENT_EFFECTS.chipPin,
};

export const displayBehavior: ComponentBehavior = {
  onArrive: ({ slot, simRefs, spawn }) => {
    if (slot.kind !== "spark") return "continue";
    simRefs.setDisplayGlow(1);
    spawn("return", slot.currentNode, 0.2);
    return "consumed";
  },
};

export const inputBehavior: ComponentBehavior = {
  spawner: { intervalSeconds: 3.4, kind: "spark", energy: 0.3 },
};

export const commandBehavior: ComponentBehavior = {
  spawner: { intervalSeconds: 5.5, kind: "command", energy: 0.6 },
};

export const outletBehavior: ComponentBehavior = {
  onClick: (simRefs) => simRefs.togglePaused(),
  spawner: { intervalSeconds: Infinity, kind: "spark", energy: 0.3 },
};

// ── Mux behavior factory ───────────────────────────────────────────────────

export interface MuxConfig {
  threshold: number;
  timeoutSeconds: number;
  minimumTimeoutCount: number;
}

export const MUX_BEHAVIOR_CONFIG: MuxConfig = {
  threshold: 6,
  timeoutSeconds: 7,
  minimumTimeoutCount: 2,
};

interface MuxInput {
  color: THREE.Color;
  energy: number;
  portIndex: number;
}

// Structural subset of a routed port that the mux actually reads — satisfied by
// both DevicePort (router output) and ResolvedPort (component registry).
export interface MuxPort {
  terminalNode: number;
  group: number;
}

export function createMuxBehavior(
  ports: MuxPort[],
  config: MuxConfig = MUX_BEHAVIOR_CONFIG
): ComponentBehavior {
  const inputs: MuxInput[] = [];
  let elapsed = 0;
  let emissionNonce = 0;

  const emit = (ctx: Omit<SparkContext, "slot">) => {
    if (inputs.length === 0) return;

    const lastPort = ports[inputs[inputs.length - 1].portIndex];
    let outputs = ports.filter((p) => p.group !== lastPort.group);
    if (outputs.length === 0) outputs = ports;

    emissionNonce += 1;
    const output = outputs[
      Math.floor(
        ((emissionNonce * 71.3 + inputs.length) % 1) * outputs.length
      )
    ];

    const mergedColor = inputs
      .reduce((c, i) => c.add(i.color), new THREE.Color(0, 0, 0))
      .multiplyScalar(1 / inputs.length);
    const mergedEnergy = Math.min(
      1,
      inputs.reduce((t, i) => t + i.energy, 0) / inputs.length + 0.2
    );

    ctx.spawn("multiplexed", output.terminalNode, mergedEnergy);

    inputs.length = 0;
    elapsed = 0;
    ctx.simRefs.setMuxCount(0);
    ctx.simRefs.setMuxPulse(1);
  };

  return {
    onArrive: ({ slot, simRefs, spawn }) => {
      if (slot.kind === "command" || slot.kind === "multiplexed") return "continue";

      const portIndex = ports.findIndex((p) => p.terminalNode === slot.currentNode);
      if (portIndex === -1) return "continue";

      inputs.push({
        color: slot.color.clone(),
        energy: slot.energy,
        portIndex,
      });

      simRefs.setMuxCount(Math.min(config.threshold, inputs.length));
      simRefs.setMuxPulse(0.35);

      if (inputs.length >= config.threshold) {
        emit({ simRefs, spawn });
      }
      return "consumed";
    },

    onUpdate: (delta, ctx) => {
      if (inputs.length === 0) return;
      elapsed += delta;
      if (elapsed >= config.timeoutSeconds && inputs.length >= config.minimumTimeoutCount) {
        emit(ctx);
      }
    },

    onClick: () => {
      inputs.length = 0;
      elapsed = 0;
    },
  };
}

// ── Visual components ──────────────────────────────────────────────────────

export function Multiplexer() {
  const simRefs = useSimRefs();
  const bodyRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const indicatorRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const [width, height] = MUX_LAYOUT.size;

  useFrame((_, delta) => {
    simRefs.setMuxPulse(Math.max(0, simRefs.muxPulse.value - delta * 1.8));
    if (bodyRef.current) {
      bodyRef.current.emissiveIntensity = 0.18 + simRefs.muxPulse.value * 2.4;
    }
    indicatorRefs.current.forEach((material, index) => {
      if (material) material.emissiveIntensity = index < simRefs.muxCount.value ? 2.2 : 0.12;
    });
  });

  return (
    <group position={[MUX_LAYOUT.center[0], MUX_LAYOUT.center[1], 0.08]}>
      <mesh>
        <boxGeometry args={[width, height, 0.16]} />
        <meshPhysicalMaterial
          ref={bodyRef}
          color="#171c26"
          emissive={PALETTE.primary}
          emissiveIntensity={0.18}
          metalness={0.82}
          roughness={0.24}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
      {Array.from({ length: MUX_BEHAVIOR_CONFIG.threshold }, (_, index) => (
        <mesh key={index} position={[-0.48 + index * 0.192, 0, 0.09]}>
          <boxGeometry args={[0.1, 0.18, 0.025]} />
          <meshStandardMaterial
            ref={(material) => { indicatorRefs.current[index] = material; }}
            color={PALETTE.secondary}
            emissive={PALETTE.secondary}
            emissiveIntensity={0.12}
            toneMapped={false}
          />
        </mesh>
      ))}
      {[...Array(6)].map((_, index) => {
        const offset = (index - 2.5) * 0.085;
        return (
          <group key={index}>
            <mesh position={[-width / 2 - 0.055, offset, 0]}>
              <boxGeometry args={[0.11, 0.028, 0.025]} />
              <meshStandardMaterial color="#d6b879" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[width / 2 + 0.055, offset, 0]}>
              <boxGeometry args={[0.11, 0.028, 0.025]} />
              <meshStandardMaterial color="#d6b879" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function Capacitor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.09]}>
        <cylinderGeometry args={[0.1, 0.1, 0.26, 16]} />
        {/* brushed aluminum can */}
        <meshPhysicalMaterial color="#20242f" metalness={0.9} roughness={0.35} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.23]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
        <meshStandardMaterial
          color={PALETTE.secondary}
          emissive={PALETTE.secondary}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function Transistor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.07]} scale={[1, 1, 0.55]}>
        <sphereGeometry args={[0.08, 16, 12]} />
        {/* polished metal can */}
        <meshPhysicalMaterial color="#242028" metalness={1.0} roughness={0.15} clearcoat={0.6} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[0, 0.02, 0.12]}>
        <circleGeometry args={[0.045, 12]} />
        <meshStandardMaterial
          color={PALETTE.tertiary}
          emissive={PALETTE.tertiary}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={i} position={[x, -0.14, 0]}>
          <boxGeometry args={[0.02, 0.12, 0.02]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export function Outlet({ position }: { position: [number, number, number] }) {
  const simRefs = useSimRefs();
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (!matRef.current) return;
    const target = simRefs.paused.value ? 0.25 : 1.8;
    matRef.current.emissiveIntensity += (target - matRef.current.emissiveIntensity) * 0.08;
  });

  return (
    <group position={[position[0] + 0.35, position[1], position[2]]}>
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          outletBehavior.onClick?.(simRefs);
        }}
      >
        <boxGeometry args={[0.42, 0.42, 0.14]} />
        <meshStandardMaterial
          ref={matRef}
          color={PALETTE.primary}
          emissive={PALETTE.primary}
          emissiveIntensity={1.8}
          toneMapped={false}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.08]}>
        <torusGeometry args={[0.14, 0.025, 8, 16]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function Display({ position }: { position: [number, number, number] }) {
  const simRefs = useSimRefs();
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    simRefs.decayDisplayGlow(delta);
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.45 + simRefs.displayGlow.value * 3.2;
    }
  });

  return (
    <group position={[position[0] - 0.32, position[1], position[2]]}>
      <mesh>
        <boxGeometry args={[0.5, 0.36, 0.06]} />
        <meshStandardMaterial
          ref={matRef}
          color={PALETTE.tertiary}
          emissive={PALETTE.tertiary}
          emissiveIntensity={0.45}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function InputDevice({ position }: { position: [number, number, number] }) {
  const simRefs = useSimRefs();
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (!matRef.current) return;
    matRef.current.emissiveIntensity = simRefs.paused.value
      ? 0.3
      : 0.9 + Math.sin(Date.now() * 0.004) * 0.4;
  });

  return (
    <group position={[position[0] + 0.32, position[1], position[2]]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.16, 12]} />
        <meshStandardMaterial
          ref={matRef}
          color={PALETTE.secondary}
          emissive={PALETTE.secondary}
          emissiveIntensity={0.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function CommandDevice({ position }: { position: [number, number, number] }) {
  const simRefs = useSimRefs();
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (!matRef.current) return;
    matRef.current.emissiveIntensity = simRefs.paused.value
      ? 0.3
      : 0.9 + Math.cos(Date.now() * 0.0035) * 0.4;
  });

  return (
    <group position={[position[0] - 0.32, position[1], position[2]]} rotation={[0, 0, Math.PI / 4]}>
      <mesh>
        <boxGeometry args={[0.24, 0.24, 0.16]} />
        <meshStandardMaterial
          ref={matRef}
          color={PALETTE.tertiary}
          emissive={PALETTE.tertiary}
          emissiveIntensity={0.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function ChipPackage({
  chip,
  chipIndex,
  layer = 0,
}: {
  chip: ChipDef;
  chipIndex: number;
  /** crystal layer the package sits on (0 = surface) */
  layer?: number;
}) {
  const [w, h] = chip.size;
  const [cx, cy] = chip.center;
  const simRefs = useSimRefs();
  const groupRef = useRef<THREE.Group>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.1)), [w, h]);

  useFrame(() => {
    const flash = simRefs.getChipFlash(chipIndex);
    const active = !!flash && flash.until > Date.now();
    const t = active ? (flash!.until - Date.now()) / 400 : 0;

    if (edgeMatRef.current) {
      edgeMatRef.current.color.copy(active ? flash!.color : PALETTE.primary);
    }
    if (groupRef.current) {
      groupRef.current.scale.setScalar(1 + t * 0.18);
    }
  });

  return (
    <group ref={groupRef} position={[cx, cy, 0.05 - layer * LAYER_SPACING]}>
      <mesh>
        <boxGeometry args={[w, h, 0.1]} />
        {/* glossy epoxy package */}
        <meshPhysicalMaterial color="#0d0d14" metalness={0.3} roughness={0.2} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={edgeMatRef} color={PALETTE.primary} toneMapped={false} />
      </lineSegments>
      <mesh position={[-w / 2 + 0.08, h / 2 - 0.08, 0.06]}>
        <circleGeometry args={[0.03, 8]} />
        <meshStandardMaterial
          color={PALETTE.secondary}
          emissive={PALETTE.secondary}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
