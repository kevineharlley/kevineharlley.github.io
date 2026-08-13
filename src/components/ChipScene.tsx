"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// ── Deterministic pseudo-random (avoids hydration mismatches) ──────────────
function rng(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Floating crystal gem ───────────────────────────────────────────────────
function Crystal({
  position,
  scale = 1,
  color,
  emissive,
  rotationSpeed = 0.5,
  floatSpeed = 1.5,
  geometry = "icosahedron",
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  emissive: string;
  rotationSpeed?: number;
  floatSpeed?: number;
  geometry?: "icosahedron" | "octahedron";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.37) * 0.22;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.25} floatIntensity={0.7}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry === "icosahedron" ? (
          <icosahedronGeometry args={[1, 0]} />
        ) : (
          <octahedronGeometry args={[1, 0]} />
        )}
        {/* clearcoat-only – no secondary transmission render pass */}
        <meshPhysicalMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.28}
          metalness={0.05}
          roughness={0.0}
          clearcoat={1}
          clearcoatRoughness={0.0}
          reflectivity={1}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

// ── Circuit board trace grid ───────────────────────────────────────────────
function CircuitTraces() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    const gridW = 18;
    const gridH = 11;
    const step = 0.85;

    const cEmerald = new THREE.Color("#ffb830");
    const cGold = new THREE.Color("#00d620");
    const cAmethyst = new THREE.Color("#a855f7");
    const palette = [cEmerald, cGold, cAmethyst];

    let seed = 0;

    // Horizontal trace segments
    for (let row = 0; row <= gridH; row++) {
      for (let col = 0; col < gridW; col++) {
        seed++;
        if (rng(seed) > 0.38) {
          const x = (col - gridW / 2) * step;
          const y = (row - gridH / 2) * step;
          const c = palette[Math.floor(rng(seed + 1000) * 3)];
          positions.push(x, y, 0, x + step, y, 0);
          colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
        }
      }
    }

    // Vertical trace segments
    for (let col = 0; col <= gridW; col++) {
      for (let row = 0; row < gridH; row++) {
        seed++;
        if (rng(seed) > 0.38) {
          const x = (col - gridW / 2) * step;
          const y = (row - gridH / 2) * step;
          const c = palette[Math.floor(rng(seed + 2000) * 3)];
          positions.push(x, y, 0, x, y + step, 0);
          colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <lineSegments
      geometry={geometry}
      rotation={[-1.1, 0, 0.18]}
      position={[0, -3.2, -1.5]}
    >
      <lineBasicMaterial vertexColors transparent opacity={0.45} />
    </lineSegments>
  );
}

// ── Via / solder-pad dots at trace intersections ───────────────────────────
const VIA_COUNT = 90;

function ViaDots() {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!ref.current) return;
    const tmp = new THREE.Object3D();
    const palette = [
      new THREE.Color("#ffb830"),
      new THREE.Color("#00d620"),
      new THREE.Color("#a855f7"),
    ];

    for (let i = 0; i < VIA_COUNT; i++) {
      const gridX = Math.round((rng(i * 7.1) - 0.5) * 18) * 0.85;
      const gridY = Math.round((rng(i * 7.1 + 3.3) - 0.5) * 11) * 0.85;
      tmp.position.set(gridX, gridY, 0.05);
      tmp.scale.setScalar(0.055 + rng(i * 7.1 + 9.9) * 0.07);
      tmp.updateMatrix();
      ref.current.setMatrixAt(i, tmp.matrix);

      const c = palette[Math.floor(rng(i * 7.1 + 55) * 3)];
      ref.current.setColorAt(i, c);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, VIA_COUNT]}
      rotation={[-1.1, 0, 0.18]}
      position={[0, -3.2, -1.5]}
    >
      <sphereGeometry args={[1, 7, 7]} />
      <meshStandardMaterial
        emissiveIntensity={1.2}
        toneMapped={false}
        vertexColors
      />
    </instancedMesh>
  );
}

// ── Animated scan line sweeping across the board ───────────────────────────
function ScanLine() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.22) % 1;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    // Sweep from top to bottom of board
    ref.current.position.y = -7 + t * 10;
    mat.opacity = 0.18 * Math.sin(t * Math.PI);
  });

  return (
    <mesh ref={ref} rotation={[-1.1, 0, 0.18]} position={[0, 0, -1.5]}>
      <planeGeometry args={[16, 0.04]} />
      <meshBasicMaterial color="#ffb830" transparent opacity={0.18} />
    </mesh>
  );
}

// ── Energy particles drifting upward ──────────────────────────────────────
const PARTICLE_COUNT = 600;

function EnergyParticles() {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (rng(i * 3.1) - 0.5) * 22;
      pos[i * 3 + 1] = (rng(i * 3.1 + 1) - 0.5) * 14;
      pos[i * 3 + 2] = (rng(i * 3.1 + 2) - 0.5) * 8 - 2;
      spd[i] = 0.003 + rng(i * 3.1 + 9) * 0.007;
    }
    return { positions: pos, speeds: spd };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] += speeds[i];
      if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -7;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#ffb830" size={0.025} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ── Mouse-reactive camera tilt ─────────────────────────────────────────────
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
    camera.position.x += (mouse.current.x * 1.4 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Exported scene wrapper ─────────────────────────────────────────────────
export function ChipScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 56 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        // Allow the browser to restore the context if it is lost
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
      }}
    >
      <color attach="background" args={["#06060f"]} />
      <fog attach="fog" args={["#06060f", 18, 38]} />

      {/* Lighting – three colored point lights for the crystal theme */}
      <ambientLight intensity={0.12} />
      <pointLight position={[5, 7, 5]} intensity={35} color="#ffb830" />
      <pointLight position={[-6, -4, 4]} intensity={28} color="#a855f7" />
      <pointLight position={[3, -6, 3]} intensity={22} color="#00c896" />
      <pointLight position={[0, 0, 6]} intensity={8} color="#ffffff" />

      <Suspense fallback={null}>
        <Stars radius={90} depth={70} count={4500} factor={3} fade speed={0.4} />

        {/* Circuit board floor */}
        <CircuitTraces />
        <ViaDots />
        <ScanLine />

        {/* Floating particles */}
        <EnergyParticles />

      </Suspense>

      <CameraRig />
    </Canvas>
  );
}

