"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Types ──────────────────────────────────────────────────────────────────
type Vec3 = [number, number, number];
type NodeType = "normal" | "capacitor" | "transistor";

interface CircuitNode {
  id: number;
  position: Vec3;
  type: NodeType;
  neighbors: number[];
}

interface CircuitEdge {
  from: number;
  to: number;
  length: number;
}

// ── Theme palette (matches globals.css) ────────────────────────────────────
const PALETTE = {
  gold: new THREE.Color("#ffb830"),
  emerald: new THREE.Color("#00d620"),
  amethyst: new THREE.Color("#a855f7"),
};

// ── Deterministic PRNG (keep your existing rng) ────────────────────────────
function rng(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Build the circuit graph (flat, top-down) ───────────────────────────────
const GRID_W = 18;
const GRID_H = 11;
const STEP = 0.85;

function buildCircuit() {
  const nodes: CircuitNode[] = [];
  const edges: CircuitEdge[] = [];
  const indexAt: Record<string, number> = {};
  let seed = 0;

  // Helper to get or create a node at a grid coordinate
  const getNode = (col: number, row: number): number => {
    const key = `${col},${row}`;
    if (indexAt[key] === undefined) {
      const x = (col - GRID_W / 2) * STEP;
      const y = (row - GRID_H / 2) * STEP;
      indexAt[key] = nodes.length;
      nodes.push({
        id: nodes.length,
        position: [x, y, 0],
        type: "normal",
        neighbors: [],
      });
    }
    return indexAt[key];
  };

  // Horizontal segments
  for (let row = 0; row <= GRID_H; row++) {
    for (let col = 0; col < GRID_W; col++) {
      seed++;
      if (rng(seed) > 0.38) {
        const a = getNode(col, row);
        const b = getNode(col + 1, row);
        nodes[a].neighbors.push(b);
        nodes[b].neighbors.push(a);
        edges.push({ from: a, to: b, length: STEP });
      }
    }
  }

  // Vertical segments
  for (let col = 0; col <= GRID_W; col++) {
    for (let row = 0; row < GRID_H; row++) {
      seed++;
      if (rng(seed) > 0.38) {
        const a = getNode(col, row);
        const b = getNode(col, row + 1);
        nodes[a].neighbors.push(b);
        nodes[b].neighbors.push(a);
        edges.push({ from: a, to: b, length: STEP });
      }
    }
  }

  // Decorate some nodes as components
  nodes.forEach((n, i) => {
    const r = rng(i * 13.7);
    if (r > 0.92) n.type = "capacitor";
    else if (r > 0.82) n.type = "transistor";
  });

  return { nodes, edges };
}

const { nodes: CIRCUIT_NODES, edges: CIRCUIT_EDGES } = buildCircuit();

// ── Circuit board geometry from the graph ──────────────────────────────────
function CircuitTraces() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const MOTHERBOARD_PALETTE = [
      new THREE.Color("#b87333"), // copper
      new THREE.Color("#d4af37"), // gold
      new THREE.Color("#5c8a5c"), // solder mask green
      new THREE.Color("#8a6db5"), // purple solder mask
    ];

    CIRCUIT_EDGES.forEach((edge, i) => {
      const a = CIRCUIT_NODES[edge.from].position;
      const b = CIRCUIT_NODES[edge.to].position;
      const c = MOTHERBOARD_PALETTE[Math.floor(rng(i * 3.7 + 1) * 4)];
      positions.push(...a, ...b);
      colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial vertexColors transparent opacity={0.45} />
    </lineSegments>
  );
}

// ── Via dots (flat, top-down) ──────────────────────────────────────────────
function ViaDots() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const palette = [PALETTE.gold, PALETTE.emerald, PALETTE.amethyst];

  useEffect(() => {
    if (!ref.current) return;
    const tmp = new THREE.Object3D();
    CIRCUIT_NODES.forEach((node, i) => {
      tmp.position.set(...node.position);
      tmp.position.z = 0.02;
      tmp.scale.setScalar(0.055 + rng(i * 7.1 + 9.9) * 0.07);
      tmp.updateMatrix();
      ref.current!.setMatrixAt(i, tmp.matrix);
      const c = palette[Math.floor(rng(i * 7.1 + 55) * 3)];
      ref.current!.setColorAt(i, c);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, CIRCUIT_NODES.length]}>
      <sphereGeometry args={[1, 7, 7]} />
      <meshStandardMaterial emissiveIntensity={1.2} toneMapped={false} vertexColors />
    </instancedMesh>
  );
}

// ── Capacitor visual (cylinder + plates) ───────────────────────────────────
function Capacitor({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.12, 0.12, 0.22, 16]} />
        <meshStandardMaterial color="#b08d57" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.22]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.06]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ── Transistor visual (small IC package with pins) ─────────────────────────
function Transistor({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.24, 0.18, 0.08]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Three pins */}
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={i} position={[x, -0.14, 0]}>
          <boxGeometry args={[0.02, 0.12, 0.02]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// ── Components layer ───────────────────────────────────────────────────────
function CircuitComponents() {
  return (
    <>
      {CIRCUIT_NODES.map(
        (node) =>
          node.type === "capacitor" && (
            <Capacitor key={`cap-${node.id}`} position={node.position} />
          )
      )}
      {CIRCUIT_NODES.map(
        (node) =>
          node.type === "transistor" && (
            <Transistor key={`trans-${node.id}`} position={node.position} />
          )
      )}
    </>
  );
}

// ── Energy spark that travels the graph ────────────────────────────────────
const SPARK_SPEED = 2.5; // units per second
const CAPACITOR_BOOST = 0.35;
const TRANSISTOR_GAIN = 1.5;

function colorForEnergy(energy: number): THREE.Color {
  // 0 -> gold, 0.5 -> emerald, 1 -> amethyst
  const c = new THREE.Color();
  if (energy < 0.5) {
    c.lerpColors(PALETTE.gold, PALETTE.emerald, energy * 2);
  } else {
    c.lerpColors(PALETTE.emerald, PALETTE.amethyst, (energy - 0.5) * 2);
  }
  return c;
}

function EnergySpark() {
  const coreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const arcRef = useRef<THREE.Line>(null);

  const state = useRef({
    currentNode: 0,
    nextNode: 0,
    progress: 0,
    energy: 0.3,
    boostFrames: 0,
    history: [] as number[],
    flicker: 0,
  });

  const ARC_SEGMENTS = 14;
  const ARC_LENGTH = 0.55;
  const arcLine = useMemo(() => {
    const positions = new Float32Array(ARC_SEGMENTS * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({
      color: PALETTE.gold,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });
    return new THREE.Line(geometry, material);
  }, []);

  useEffect(() => {
    const startIndex = Math.floor(rng(Date.now()) * CIRCUIT_NODES.length);
    const start = CIRCUIT_NODES[startIndex];
    const validStart =
      start.neighbors.length > 0
        ? start
        : CIRCUIT_NODES.find((n) => n.neighbors.length > 0) ?? CIRCUIT_NODES[0];

    state.current.currentNode = validStart.id;
    state.current.nextNode =
      validStart.neighbors[
        Math.floor(rng(Date.now() + 1) * validStart.neighbors.length)
      ];
  }, []);

  useFrame((_, delta) => {
    if (!coreRef.current || !lightRef.current || !arcRef.current) return;

    const s = state.current;
    const from = CIRCUIT_NODES[s.currentNode];
    const to = CIRCUIT_NODES[s.nextNode];

    const fromVec = new THREE.Vector3(...from.position);
    const toVec = new THREE.Vector3(...to.position);
    const dist = fromVec.distanceTo(toVec);

    s.progress += (SPARK_SPEED * delta) / Math.max(0.01, dist);

    const pos = new THREE.Vector3().lerpVectors(fromVec, toVec, Math.min(1, s.progress));
    pos.z = 0.06;

    // Centralized jagged arc
    const positions = arcLine.geometry.attributes.position.array as Float32Array;
    const backT = Math.max(0, s.progress - ARC_LENGTH / dist);
    const backPos = new THREE.Vector3().lerpVectors(fromVec, toVec, backT);
    const arcDir = new THREE.Vector3().subVectors(pos, backPos).normalize();
    const arcPerp = new THREE.Vector3(-arcDir.y, arcDir.x, 0);

    for (let i = 0; i < ARC_SEGMENTS; i++) {
      const t = i / (ARC_SEGMENTS - 1);
      const base = new THREE.Vector3().lerpVectors(backPos, pos, t);
      const tipFactor = Math.pow(t, 0.6);
      const jitter =
        (rng(i * 13.7 + s.progress * 2000 + Date.now() * 0.02) - 0.5) *
        0.22 *
        tipFactor *
        (1 + s.energy);
      base.addScaledVector(arcPerp, jitter);
      base.z = 0.04;
      positions[i * 3] = base.x;
      positions[i * 3 + 1] = base.y;
      positions[i * 3 + 2] = base.z;
    }
    arcLine.geometry.attributes.position.needsUpdate = true;

    coreRef.current.position.copy(pos);
    lightRef.current.position.copy(pos);

    s.energy = Math.max(0.1, s.energy - delta * 0.15);
    s.flicker = Math.sin(Date.now() * 0.025) * 0.3 + Math.random() * 0.5;
    if (s.boostFrames > 0) s.boostFrames--;

    if (s.progress >= 1) {
      s.progress = 0;
      s.currentNode = s.nextNode;
      const node = CIRCUIT_NODES[s.currentNode];

      if (node.type === "capacitor") {
        s.energy = Math.min(1, s.energy + CAPACITOR_BOOST);
        s.boostFrames = 20;
      } else if (node.type === "transistor") {
        s.energy = Math.min(1, s.energy * TRANSISTOR_GAIN);
        s.boostFrames = 20;
      }

      s.history.push(s.currentNode);
      if (s.history.length > 20) s.history.shift();

      let candidates = node.neighbors.filter((n) => !s.history.includes(n));
      if (candidates.length === 0) {
        candidates = node.neighbors.filter((n) => n !== s.currentNode);
      }
      if (candidates.length === 0) {
        s.nextNode = node.neighbors[0] ?? s.currentNode;
      } else {
        s.nextNode = candidates[Math.floor(rng(s.currentNode * 7.1) * candidates.length)];
      }
    }

    const color = colorForEnergy(s.energy);
    const boostScale = s.boostFrames > 0 ? 1.5 : 1;
    const intensity = (1 + s.energy * 3) * (1 + s.flicker);

    coreRef.current.scale.setScalar(0.055 * boostScale);
    (coreRef.current.material as THREE.MeshBasicMaterial).color.copy(color);
    lightRef.current.color.copy(color);
    lightRef.current.intensity = intensity * 7;

    (arcLine.material as THREE.LineBasicMaterial).color.copy(color);
    (arcLine.material as THREE.LineBasicMaterial).opacity = 0.6 + s.flicker * 0.4;
  });

  return (
    <>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={PALETTE.gold} />
      </mesh>
      <pointLight ref={lightRef} color={PALETTE.gold} intensity={7} distance={5} decay={2} />
      <primitive object={arcLine} ref={arcRef} />
    </>
  );
}

// ── Camera rig (gentle parallax, no tilt of the board) ─────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    // Subtle camera drift, board stays flat
    camera.position.x += (mouse.current.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Exported scene wrapper ─────────────────────────────────────────────────
export function ChipScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
      }}
    >
      <color attach="background" args={["#06060f"]} />
      <fog attach="fog" args={["#06060f", 22, 45]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 8]} intensity={15} color="#ffffff" />

      <Suspense fallback={null}>
        <CircuitTraces />
        <ViaDots />
        <CircuitComponents />
        <EnergySpark />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}