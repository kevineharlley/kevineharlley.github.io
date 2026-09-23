"use client";

// ── SparkField: behavior-driven packet executor ────────────────────────────
// Owns the slot pool, movement, and rendering. All game logic lives in
// ComponentBehavior objects registered per node. SparkField dispatches
// arrivals and spawns but knows nothing about muxes, displays, or chips.

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ComponentBehavior, ResolvedComponent, SparkKind, SparkSlot } from "./types";
import { getCircuit } from "./circuitLayout";
import { PALETTE, COMPONENT_EFFECTS, useSimRefs } from "./circuitComponents";

// ── Constants ──────────────────────────────────────────────────────────────

const MAX_SPARKS = 10;
const SPARK_SPEED = 2.5;
const COMMAND_SPEED = 1.8;
const ARC_SEGMENTS = 14;
const ARC_LENGTH = 0.55;

// ── Helpers ────────────────────────────────────────────────────────────────

function rng(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function createSlot(): SparkSlot {
  return {
    active: false,
    kind: "spark",
    currentNode: 0,
    nextNode: 0,
    progress: 0,
    energy: 0.3,
    boostFrames: 0,
    history: [],
    flicker: 0,
    color: new THREE.Color(PALETTE.secondary),
    routeNonce: 0,
  };
}

// ── SparkField component ───────────────────────────────────────────────────

interface SparkFieldProps {
  behaviors: Map<number, ComponentBehavior>;
}

export function SparkField({ behaviors }: SparkFieldProps) {
  const simRefs = useSimRefs();
  const circuit = getCircuit();
  const nodes = circuit.nodes;

  // Derived lookups from the unified component registry
  const outletNode = circuit.components.find((c) => c.def.kind === "outlet")!.node!;
  const componentByDevice = useMemo(() => {
    const map = new Map<number, ResolvedComponent>();
    circuit.components.forEach((c) => {
      if (c.def.kind === "chip" || c.def.kind === "mux") map.set(c.device, c);
    });
    return map;
  }, [circuit]);

  const slotsRef = useRef<SparkSlot[]>(
    Array.from({ length: MAX_SPARKS }, () => createSlot())
  );
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([]);
  const boxRefs = useRef<(THREE.Mesh | null)[]>([]);
  const multiplexedRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);

  // Reusable temp vectors (avoid per-frame allocation)
  const tempFromVecs = useRef<THREE.Vector3[]>(
    Array.from({ length: MAX_SPARKS }, () => new THREE.Vector3())
  );
  const tempToVecs = useRef<THREE.Vector3[]>(
    Array.from({ length: MAX_SPARKS }, () => new THREE.Vector3())
  );
  const tempPosVecs = useRef<THREE.Vector3[]>(
    Array.from({ length: MAX_SPARKS }, () => new THREE.Vector3())
  );
  const tempBackVecs = useRef<THREE.Vector3[]>(
    Array.from({ length: MAX_SPARKS }, () => new THREE.Vector3())
  );
  const tempArcDirVecs = useRef<THREE.Vector3[]>(
    Array.from({ length: MAX_SPARKS }, () => new THREE.Vector3())
  );
  const tempArcPerpVecs = useRef<THREE.Vector3[]>(
    Array.from({ length: MAX_SPARKS }, () => new THREE.Vector3())
  );
  const tempBaseVecs = useRef<THREE.Vector3[]>(
    Array.from({ length: MAX_SPARKS }, () => new THREE.Vector3())
  );

  // Spawner timers, keyed by node ID
  const spawnerTimers = useRef<Map<number, number>>(new Map());

  // Each slot owns one reusable jagged line
  const arcLines = useMemo(
    () =>
      Array.from({ length: MAX_SPARKS }, () => {
        const positions = new Float32Array(ARC_SEGMENTS * 3);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({
          color: PALETTE.secondary,
          transparent: true,
          opacity: 0.8,
        });
        return new THREE.Line(geometry, material);
      }),
    []
  );

  const pickNextNode = (slot: SparkSlot): number => {
    const node = nodes[slot.currentNode];
    let candidates = node.neighbors.filter((n) => !slot.history.includes(n));
    if (candidates.length === 0) candidates = node.neighbors.filter((n) => n !== slot.currentNode);
    if (candidates.length === 0) return node.neighbors[0] ?? slot.currentNode;
    // Prefer continuing on the same layer: vertical hops (via ramps) should
    // feel like deliberate dives rather than noise.
    const sameLayer = candidates.filter((n) => nodes[n].layer === node.layer);
    if (sameLayer.length > 0 && rng(slot.currentNode * 3.1 + slot.routeNonce * 57.7) > 0.22) {
      candidates = sameLayer;
    }
    slot.routeNonce += 1;
    return candidates[
      Math.floor(rng(slot.currentNode * 7.1 + slot.routeNonce * 997.3) * candidates.length)
    ];
  };

  const applyComponentEffect = (slot: SparkSlot, effect: typeof COMPONENT_EFFECTS.capacitor) => {
    slot.color.copy(effect.color);
    slot.energy = effect.energyOp(slot.energy);
    slot.boostFrames = effect.boostFrames;
  };

  const spawnSpark = (kind: SparkKind, startNode: number, energy: number) => {
    const free = slotsRef.current.find((s) => !s.active);
    if (!free) return;
    free.active = true;
    free.kind = kind;
    free.currentNode = startNode;
    free.history = [startNode];
    free.progress = 0;
    free.energy = energy;
    free.boostFrames = 0;
    free.absorbed = undefined;
    free.routeNonce += 1;
    free.color.copy(
      kind === "return" ? COMPONENT_EFFECTS.transistor.color : COMPONENT_EFFECTS.capacitor.color
    );
    free.nextNode = pickNextNode(free);
  };

  // Seed the simulation once on mount
  useEffect(() => {
    spawnSpark("spark", outletNode, 0.3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outletNode]);

  useFrame((_, delta) => {
    const slots = slotsRef.current;
    const paused = simRefs.paused.value;

    // Run spawners
    if (!paused) {
      behaviors.forEach((behavior, nodeId) => {
        if (!behavior.spawner) return;
        const timer = spawnerTimers.current.get(nodeId) ?? behavior.spawner.intervalSeconds * 0.5;
        const remaining = timer - delta;
        if (remaining <= 0) {
          spawnerTimers.current.set(nodeId, behavior.spawner.intervalSeconds);
          spawnSpark(behavior.spawner.kind, nodeId, behavior.spawner.energy);
        } else {
          spawnerTimers.current.set(nodeId, remaining);
        }
      });

      // Run stateful behavior updates (mux timeout, etc.)
      behaviors.forEach((behavior) => {
        behavior.onUpdate?.(delta, { simRefs, spawn: spawnSpark });
      });
    }

    for (let i = 0; i < MAX_SPARKS; i++) {
      const slot = slots[i];
      const sphere = sphereRefs.current[i];
      const box = boxRefs.current[i];
      const multiplexed = multiplexedRefs.current[i];
      const light = lightRefs.current[i];
      const arcLine = arcLines[i];
      if (!sphere || !box || !multiplexed || !light) continue;

      if (!slot.active) {
        sphere.visible = false;
        box.visible = false;
        multiplexed.visible = false;
        light.visible = false;
        arcLine.visible = false;
        continue;
      }

      const isCommand = slot.kind === "command";
      const isMultiplexed = slot.kind === "multiplexed";
      sphere.visible = !isCommand && !isMultiplexed;
      box.visible = isCommand;
      multiplexed.visible = isMultiplexed;
      light.visible = true;
      arcLine.visible = true;
      const core = isCommand ? box : isMultiplexed ? multiplexed : sphere;

      if (paused) continue;

      // Chip absorption dwell
      if (slot.absorbed) {
        slot.absorbed.remaining -= delta;
        core.scale.setScalar(0.025);
        light.intensity = 2;
        arcLine.visible = false;

        if (slot.absorbed.remaining <= 0) {
          const { chipIndex, entryPin } = slot.absorbed;
          const chipPorts = componentByDevice.get(chipIndex)?.ports ?? [];
          const entrySide = chipPorts.find((p) => p.terminalNode === entryPin)?.side;
          let outputs = chipPorts.filter(
            (p) => p.terminalNode !== entryPin && p.side !== entrySide && p.outwardNode !== undefined
          );
          if (outputs.length === 0) {
            outputs = chipPorts.filter(
              (p) => p.terminalNode !== entryPin && p.outwardNode !== undefined
            );
          }
          const output = outputs[
            Math.floor(rng(slot.routeNonce * 43.7 + chipIndex) * outputs.length)
          ];
          slot.currentNode = output.terminalNode;
          slot.nextNode = output.outwardNode!;
          slot.progress = 0;
          // reset trail so it doesn't streak across the chip
          const p = nodes[output.terminalNode].position;
          const positions = arcLines[i].geometry.attributes.position.array as Float32Array;
          for (let s = 0; s < ARC_SEGMENTS; s++) {
            positions[s * 3] = p[0];
            positions[s * 3 + 1] = p[1];
            positions[s * 3 + 2] = p[2] + 0.04;
          }
          arcLines[i].geometry.attributes.position.needsUpdate = true;
          slot.history = [output.terminalNode];
          slot.absorbed = undefined;
        }
        continue;
      }

      // Movement along edge
      const from = nodes[slot.currentNode];
      const to = nodes[slot.nextNode];
      const fromVec = tempFromVecs.current[i].set(...from.position);
      const toVec = tempToVecs.current[i].set(...to.position);
      const dist = Math.max(0.01, fromVec.distanceTo(toVec));
      const speed = isCommand ? COMMAND_SPEED : SPARK_SPEED;

      slot.progress += (speed * delta) / dist;

      const pos = tempPosVecs.current[i].copy(fromVec).lerp(toVec, Math.min(1, slot.progress));
      pos.z += 0.06; // ride just above the trace plane (z already interpolated by lerp)

      // Safety net: a spark trapped deep in the crystal (no productive route)
      // teleports back to the outlet rather than circling forever.
      const deep = from.layer > 0 || to.layer > 0;
      slot.deepTime = deep ? (slot.deepTime ?? 0) + delta : 0;
      if ((slot.deepTime ?? 0) > 14) {
        slot.deepTime = 0;
        slot.currentNode = outletNode;
        slot.nextNode = pickNextNode(slot);
        slot.progress = 0;
        slot.history = [slot.currentNode];
        continue;
      }

      // Jagged trail
      const positions = arcLine.geometry.attributes.position.array as Float32Array;
      const backT = Math.max(0, slot.progress - ARC_LENGTH / dist);
      const backPos = tempBackVecs.current[i].copy(fromVec).lerp(toVec, backT);
      const arcDir = tempArcDirVecs.current[i].subVectors(pos, backPos).normalize();
      const arcPerp = tempArcPerpVecs.current[i].set(-arcDir.y, arcDir.x, 0);

      // Draw the jagged trail for the spark
      for (let s = 0; s < ARC_SEGMENTS; s++) {
        const t = s / (ARC_SEGMENTS - 1);
        const base = tempBaseVecs.current[i].copy(backPos).lerp(pos, t);
        const tipFactor = Math.pow(t, 0.6);

        const jitter =
          (rng(s * 13.7 + slot.progress * 2000 + i * 91 + Date.now() * 0.02) - 0.5) *
          0.03 *
          tipFactor *
          (1 + slot.energy);

        base.z += 0.04; // trail follows the spark's z (both endpoints already in 3D)
        positions[s * 3] = base.x;
        positions[s * 3 + 1] = base.y;
        positions[s * 3 + 2] = base.z;
      }
      arcLine.geometry.attributes.position.needsUpdate = true;

      core.position.copy(pos);
      light.position.copy(pos);

      slot.energy = Math.max(0.1, slot.energy - delta * 0.15);
      slot.flicker = Math.sin(Date.now() * 0.025 + i) * 0.3 + Math.random() * 0.5;
      if (slot.boostFrames > 0) slot.boostFrames--;

      // Arrival handling: behavior dispatch
      if (slot.progress >= 1) {
        slot.progress = 0;
        slot.currentNode = slot.nextNode;
        const node = nodes[slot.currentNode];

        const behavior = behaviors.get(slot.currentNode);

        // Command packets hitting a chip pin get consumed with a flash
        const port = circuit.portByTerminalNode.get(slot.currentNode);
        if (isCommand && port && port.device >= 0) {
          simRefs.flashChip(
            port.device,
            [PALETTE.secondary, PALETTE.primary, PALETTE.tertiary][port.device % 3]
          );
          slot.active = false;
          continue;
        }

        if (behavior?.onArrive) {
          const result = behavior.onArrive({ slot, simRefs, spawn: spawnSpark });
          if (result === "consumed") {
            slot.active = false;
            continue;
          }
        }

        // Chip pin absorption (dwell + re-emit) — chips only
        if (!isCommand && port && port.device >= 0 && !slot.absorbed) {
          applyComponentEffect(slot, COMPONENT_EFFECTS.chipPin);
          slot.absorbed = {
            chipIndex: port.device,
            entryPin: slot.currentNode,
            remaining: COMPONENT_EFFECTS.chipPin.dwellSeconds ?? 0,
          };
          simRefs.flashChip(port.device, COMPONENT_EFFECTS.chipPin.color);
          continue;
        }

        // Passive component effects
        if (node.type === "capacitor") {
          applyComponentEffect(slot, COMPONENT_EFFECTS.capacitor);
        } else if (node.type === "transistor") {
          applyComponentEffect(slot, COMPONENT_EFFECTS.transistor);
        }

        slot.history.push(slot.currentNode);
        if (slot.history.length > 20) slot.history.shift();
        slot.nextNode = pickNextNode(slot);
      }

      // Visual updates
      const color = isCommand ? PALETTE.tertiary : slot.color;
      const boostScale = slot.boostFrames > 0 ? 1.5 : 1;
      const baseScale = slot.kind === "return" ? 0.6 : 1;
      // interpolated depth: 0 on surface, up to LAYER_COUNT-1 deep
      const depth = from.layer + (to.layer - from.layer) * Math.min(1, slot.progress);
      const attenuation = Math.pow(0.8, depth); // ~40% dimmer per layer
      
      const intensity = (1 + slot.energy * 3) * (1 + slot.flicker) * attenuation;
      light.intensity = intensity * (isCommand ? 2 : 3) * baseScale;
      
      core.scale.setScalar((isMultiplexed ? 0.085 : 0.055) * boostScale * baseScale * (0.6 + 0.4 * attenuation));
      (arcLine.material as THREE.LineBasicMaterial).opacity = (0.6 + slot.flicker * 0.4) * attenuation;

      (arcLine.material as THREE.LineBasicMaterial).color.copy(color);
      (arcLine.material as THREE.LineBasicMaterial).opacity = 0.6 + slot.flicker * 0.4;
    }
  });

  return (
    <>
      {arcLines.map((line, i) => (
        <group key={i}>
          <mesh ref={(el) => { sphereRefs.current[i] = el; }} visible={false}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={PALETTE.secondary} />
          </mesh>
          <mesh ref={(el) => { boxRefs.current[i] = el; }} visible={false} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[1.3, 1.3, 1.3]} />
            <meshBasicMaterial color={PALETTE.tertiary} />
          </mesh>
          <mesh ref={(el) => { multiplexedRefs.current[i] = el; }} visible={false}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={PALETTE.primary} />
          </mesh>
          <pointLight
            ref={(el) => { lightRefs.current[i] = el; }}
            color={PALETTE.secondary}
            intensity={0.02}
            distance={0.48}
            decay={2}
          />
          <primitive object={line} />
        </group>
      ))}
    </>
  );
}
