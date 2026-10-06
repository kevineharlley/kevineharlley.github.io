"use client";

// ── Component rendering: meshes driven by instance anim state ─────────────
// All geometry/material data lives in MESH_SPECS (devices.ts); each mesh reads
// its own component instance's anim in useFrame — no parallel SimRefs arrays.
// The only shared context left is Simulation (global paused/togglePaused).

import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { createContext, useContext, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import type { Component } from "./Devices";
import { MESH_SPECS, MUX_CENTER, MUX_SIZE, MUX_THRESHOLD, PALETTE } from "./Devices";
import { LAYER_SPACING } from "./CircuitLayout";

export { PALETTE } from "./Devices";

// ── Global simulation state (pause only) ───────────────────────────────────

export interface Simulation {
  paused: { value: boolean };
  togglePaused: () => void;
}

export function createSimulation(): Simulation {
  const state: Simulation = {
    paused: { value: false },
    togglePaused: () => {
      state.paused.value = !state.paused.value;
    },
  };
  return state;
}

export const SimulationContext = createContext<Simulation | null>(null);

export function useSimulation(): Simulation {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("Simulation context not available");
  return ctx;
}

// ── ComponentMesh: generic renderer driven by MESH_SPECS + component.anim ──

export function ComponentMesh({ component }: { component: Component }) {
  const spec = MESH_SPECS[component.kind];
  switch (spec.geometry.type) {
    case "chip":
      return <ChipMesh component={component} />;
    case "mux":
      return <MuxMesh component={component} />;
    default:
      return <SimpleMesh component={component} />;
  }
}

// Box / cylinder / sphere bodies shared by rail devices and passives.
function SimpleMesh({ component }: { component: Component }) {
  const sim = useSimulation();
  const spec = MESH_SPECS[component.kind];
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const { theme } = useTheme();
  const accent = PALETTE[spec.accent];
  const accentHex = `#${accent.getHexString()}`;
  const pos = component.nodePosition ?? [0, 0, 0];
  const groupPos: [number, number, number] = [
    pos[0] + spec.offset[0],
    pos[1] + spec.offset[1],
    pos[2] + spec.offset[2],
  ];

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const a = component.anim;
    const paused = sim.paused.value;
    switch (spec.animChannel) {
      case "glow":
        a.glow = Math.max(0, a.glow - delta * 1.1);
        matRef.current.emissiveIntensity = 0.45 + a.glow * 3.2;
        break;
      case "pause-fade": {
        const target = paused ? 0.25 : 1.8;
        matRef.current.emissiveIntensity += (target - matRef.current.emissiveIntensity) * 0.08;
        break;
      }
      case "pause-pulse-sin":
        matRef.current.emissiveIntensity = paused ? 0.3 : 0.9 + Math.sin(Date.now() * 0.004) * 0.4;
        break;
      case "pause-pulse-cos":
        matRef.current.emissiveIntensity = paused ? 0.3 : 0.9 + Math.cos(Date.now() * 0.0035) * 0.4;
        break;
      default:
        break;
    }
  });

  const onClick =
    component.kind === "outlet"
      ? (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        component.onClick?.(sim);
      }
      : undefined;

  // Animated material — the mesh carrying matRef is driven by animChannel.
  const mat = (
    <meshStandardMaterial
      ref={matRef}
      color={accentHex}
      emissive={accentHex}
      emissiveIntensity={spec.animChannel === "none" ? 1.6 : 0.45}
      toneMapped={false}
      metalness={0.4}
      roughness={0.4}
    />
  );
  const darkMetal = <meshStandardMaterial color="#15161f" metalness={0.75} roughness={0.35} />;

  // ── Corner devices: bespoke models ──

  if (component.kind === "outlet") {
    // Power socket: hex housing, glowing core, gold retaining ring, center pin.
    return (
      <group position={groupPos}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.26, 0.3, 0.1, 6]} />
          {darkMetal}
        </mesh>
        <mesh onClick={onClick} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.08]}>
          <cylinderGeometry args={[0.15, 0.15, 0.14, 24]} />
          {mat}
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <torusGeometry args={[0.19, 0.02, 8, 24]} />
          <meshStandardMaterial color="#d6b879" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.16]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
          <meshStandardMaterial color="#0a0a10" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  if (component.kind === "display") {
    // Screen: dark bezel, glowing panel, status LED.
    return (
      <group position={groupPos}>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.62, 0.46, 0.07]} />
          {darkMetal}
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.5, 0.34, 0.02]} />
          {mat}
        </mesh>
        <mesh position={[0.24, -0.19, 0.081]}>
          <circleGeometry args={[0.015, 8]} />
          <meshStandardMaterial color={`#${PALETTE.primary.getHexString()}`} emissive={`#${PALETTE.primary.getHexString()}`} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
    );
  }

  if (component.kind === "input") {
    // Sensor mast: stepped base, metal stem, glowing orb tip.
    return (
      <group position={groupPos}>
        <mesh position={[0, 0, 0.03]}>
          <cylinderGeometry args={[0.15, 0.19, 0.06, 16]} />
          {darkMetal}
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.03, 0.05, 0.2, 10]} />
          <meshStandardMaterial color="#9aa0b0" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.3]}>
          <sphereGeometry args={[0.1, 16, 12]} />
          {mat}
        </mesh>
      </group>
    );
  }

  if (component.kind === "command") {
    // Command crystal: octahedron hovering over an octagonal plinth.
    return (
      <group position={groupPos}>
        <mesh position={[0, 0, 0.03]}>
          <cylinderGeometry args={[0.13, 0.17, 0.05, 8]} />
          {darkMetal}
        </mesh>
        <mesh position={[0, 0, 0.18]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.12]} />
          {mat}
        </mesh>
      </group>
    );
  }

  // ── Passives: generic body + scaled-down accents ──
  const body = (() => {
    const g = spec.geometry;
    switch (g.type) {
      case "box":
        return <boxGeometry args={g.args} />;
      case "cylinder":
        return <cylinderGeometry args={g.args} />;
      case "sphere":
        return <sphereGeometry args={g.args} />;
      default:
        return null;
    }
  })();

  return (
    <group position={groupPos}>
      <mesh>
        {body}
        {mat}
      </mesh>
      {component.kind === "capacitor" && (
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.065, 0.065, 0.015, 12]} />
          <meshStandardMaterial color={accentHex} emissive={accentHex} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      )}
      {component.kind === "transistor" && (
        <>
          <mesh position={[0, 0.01, 0.04]}>
            <circleGeometry args={[0.028, 12]} />
            <meshStandardMaterial color={accentHex} emissive={accentHex} emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          {[-0.05, 0, 0.05].map((x, i) => (
            <mesh key={i} position={[x, -0.085, -0.04]}>
              <boxGeometry args={[0.014, 0.09, 0.014]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

// Chip package: reads its own anim.flash for the edge glow / scale pop.
function ChipMesh({ component }: { component: Component }) {
  const [w, h] = component.size ?? [1, 1];
  const [cx, cy] = component.center ?? [0, 0];
  const groupRef = useRef<THREE.Group>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.1)), [w, h]);
  const { theme } = useTheme();
  const accent = PALETTE[component.accent ?? "primary"];
  const accentHex = `#${accent.getHexString()}`;

  // Leads derive from the declared ports — same placement math as the router.
  const leads = useMemo(() => {
    const spread = component.portSpread ?? 0.8;
    return component.ports.map((p) => {
      const isVertical = p.side === "top" || p.side === "bottom";
      const along = -((isVertical ? w : h) * spread) / 2 + p.t * (isVertical ? w : h) * spread;
      const pos: [number, number, number] =
        p.side === "top" ? [along, h / 2 + 0.04, 0]
          : p.side === "bottom" ? [along, -h / 2 - 0.04, 0]
            : p.side === "left" ? [-w / 2 - 0.04, along, 0]
              : [w / 2 + 0.04, along, 0];
      const size: [number, number, number] = isVertical ? [0.045, 0.09, 0.03] : [0.09, 0.045, 0.03];
      return { id: p.id, pos, size };
    });
  }, [component, w, h]);

  useFrame(() => {
    const active = component.anim.flashUntil > Date.now();
    const t = active ? (component.anim.flashUntil - Date.now()) / 400 : 0;
    if (edgeMatRef.current) {
      edgeMatRef.current.color.copy(active ? component.anim.flashColor : accent);
    }
    if (groupRef.current) {
      groupRef.current.scale.setScalar(1 + t * 0.18);
    }
  });

  const leadMeshRef = useRef<THREE.InstancedMesh>(null);
  const leadCount = leads.length;

  useMemo(() => {
    // fill instance matrices once per layout
    const dummy = new THREE.Object3D();
    // stored so the effect below can run after mount
    (leadMeshRef as unknown as { _leads?: typeof leads })._leads = leads;
    void dummy;
  }, [leads]);

  // populate instances after mount
  useEffect(() => {
    const mesh = leadMeshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    leads.forEach((lead, i) => {
      dummy.position.set(...lead.pos);
      dummy.scale.set(lead.size[0], lead.size[1], lead.size[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [leads]);

  return (
    <group ref={groupRef} position={[cx, cy, 0.05 - component.layer * LAYER_SPACING]}>
      <mesh>
        <boxGeometry args={[w, h, 0.1]} />
        {/* glossy epoxy package */}
        <meshPhysicalMaterial color="#0d0d14" emissive={accentHex} emissiveIntensity={0.12} metalness={0.4} roughness={0.2} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={edgeMatRef} color={accentHex} toneMapped={false} />
      </lineSegments>
      <instancedMesh ref={leadMeshRef} args={[undefined, undefined, leadCount]} key={leadCount}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#b8bcc8" metalness={0.9} roughness={0.3} />
      </instancedMesh>
      <mesh position={[-w / 2 + 0.08, h / 2 - 0.08, 0.06]}>
        <circleGeometry args={[0.03, 8]} />
        <meshStandardMaterial color={accentHex} emissive={accentHex} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Multiplexer: LED count + body pulse read from its own anim.
function MuxMesh({ component }: { component: Component }) {
  const bodyRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const indicatorRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const [width, height] = MUX_SIZE;
  const { theme } = useTheme();

  const grooveRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const a = component.anim;
    a.pulse = Math.max(0, a.pulse - delta * 1.8);
    a.laneFlash[0] = Math.max(0, a.laneFlash[0] - delta * 1.2);
    a.laneFlash[1] = Math.max(0, a.laneFlash[1] - delta * 1.2);
    if (bodyRef.current) bodyRef.current.emissiveIntensity = 0.18 + a.pulse * 2.4;
    indicatorRefs.current.forEach((material, index) => {
      if (material) material.emissiveIntensity = index < a.count ? 2.2 : 0.12;
    });
    grooveRefs.current.forEach((material, index) => {
      if (material) material.emissiveIntensity = 0.15 + a.laneFlash[index] * 2.5;
    });
    if (ringRef.current) ringRef.current.rotation.z += delta * (a.count > 0 ? 0.9 : 0.15);
  });

  useFrame((_, delta) => {
    const a = component.anim;
    a.pulse = Math.max(0, a.pulse - delta * 1.8);
    if (bodyRef.current) {
      bodyRef.current.emissiveIntensity = 0.18 + a.pulse * 2.4;
    }
    indicatorRefs.current.forEach((material, index) => {
      if (material) material.emissiveIntensity = index < a.count ? 2.2 : 0.12;
    });
  });

  return (
    <group position={[MUX_CENTER[0], MUX_CENTER[1], 0.08]}>
      <mesh>
        <boxGeometry args={[width, height, 0.16]} />
        <meshPhysicalMaterial
          ref={bodyRef}
          color="#171c26"
          emissive={`#${PALETTE.primary.getHexString()}`}
          emissiveIntensity={0.18}
          metalness={0.82}
          roughness={0.24}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
      {Array.from({ length: MUX_THRESHOLD }, (_, index) => (
        <mesh key={index} position={[-0.48 + index * 0.192, 0, 0.09]}>
          <boxGeometry args={[0.1, 0.18, 0.025]} />
          <meshStandardMaterial
            ref={(material) => { indicatorRefs.current[index] = material; }}
            color={`#${PALETTE.secondary.getHexString()}`}
            emissive={`#${PALETTE.secondary.getHexString()}`}
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
      {/* emissive lane grooves along each edge */}
      {(["left", "right"] as const).map((side, i) => (
        <mesh key={side} position={[i === 0 ? -width / 2 - 0.01 : width / 2 + 0.01, 0, 0.05]}>
          <boxGeometry args={[0.02, height * 0.8, 0.02]} />
          <meshStandardMaterial
            ref={(m) => { grooveRefs.current[i] = m; }}
            color={`#${PALETTE.primary.getHexString()}`}
            emissive={`#${PALETTE.primary.getHexString()}`}
            emissiveIntensity={0.15}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* scan ring */}
      <mesh ref={ringRef} position={[0, 0, 0.1]}>
        <torusGeometry args={[Math.min(width, height) * 0.55, 0.012, 6, 40]} />
        <meshStandardMaterial color={`#${PALETTE.quarternary.getHexString()}`} emissive={`#${PALETTE.quarternary.getHexString()}`} emissiveIntensity={1.1} toneMapped={false} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
