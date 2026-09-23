"use client";

// ── ChipScene: composition root ────────────────────────────────────────────
// Assembles the Canvas, lights, board renderer, spark simulation, and camera.
// All behavior logic lives in ChipComponents; all layout lives in circuitLayout.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getCircuit } from "./circuitLayout";
import {
  capacitorBehavior,
  chipPinBehavior,
  commandBehavior,
  createMuxBehavior,
  createSimulationRefs,
  displayBehavior,
  inputBehavior,
  outletBehavior,
  SimRefsContext,
  transistorBehavior,
} from "./circuitComponents";
import type { ComponentBehavior } from "./types";
import { BoardRenderer } from "./BoardRenderer";
import { SparkField } from "./SparkField";

// ── Camera rig ─────────────────────────────────────────────────────────────

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
    camera.position.x += (mouse.current.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Procedural alpha map for vignette plane ────────────────────────────────

function useProceduralAlphaMap() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, "black");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

// ── Scene ──────────────────────────────────────────────────────────────────

export function ChipScene() {
  const alphaMap = useProceduralAlphaMap();
  const circuit = getCircuit();
  const simRefs = useRef(
    createSimulationRefs(circuit.components.filter((c) => c.def.kind === "chip").length)
  );

  // Build behavior registry from the unified component list: nodeId → ComponentBehavior
  const behaviors = useMemo(() => {
    const map = new Map<number, ComponentBehavior>();
    const muxComp = circuit.components.find((c) => c.def.kind === "mux")!;
    const muxBehavior = createMuxBehavior(muxComp.ports);

    circuit.components.forEach((comp) => {
      switch (comp.def.kind) {
        case "outlet":
          if (comp.node !== undefined) map.set(comp.node, outletBehavior);
          break;
        case "display":
          if (comp.node !== undefined) map.set(comp.node, displayBehavior);
          break;
        case "input":
          if (comp.node !== undefined) map.set(comp.node, inputBehavior);
          break;
        case "command":
          if (comp.node !== undefined) map.set(comp.node, commandBehavior);
          break;
        case "capacitor":
          if (comp.node !== undefined) map.set(comp.node, capacitorBehavior);
          break;
        case "transistor":
          if (comp.node !== undefined) map.set(comp.node, transistorBehavior);
          break;
        case "chip":
          comp.ports.forEach((p) => map.set(p.terminalNode, chipPinBehavior));
          break;
        case "mux":
          comp.ports.forEach((p) => map.set(p.terminalNode, muxBehavior));
          break;
      }
    });

    return map;
  }, [circuit]);

  return (
    <SimRefsContext.Provider value={simRefs.current}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
        }}
      >
        <color attach="background" args={["var(--color-void)"]} />
        <fog attach="fog" args={["#06060f", 22, 45]} />

        <ambientLight intensity={0.12} />
        <pointLight position={[0, 0, 8]} intensity={5} color="#ffffff" />
        <directionalLight position={[6, 8, 10]} intensity={0.9} color="#dfe8ff" />

        <Suspense fallback={null}>
          <BoardRenderer />
          <SparkField behaviors={behaviors} />
          <mesh position={[0, 0, -2.6]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial
              color="#000"
              metalness={0.65}
              roughness={0.2}
              transparent
              alphaMap={alphaMap}
            />
          </mesh>
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.75}
            luminanceSmoothing={0.9}
            height={300}
            intensity={0.6}
          />
        </EffectComposer>
        <CameraRig />
      </Canvas>
    </SimRefsContext.Provider>
  );
}
