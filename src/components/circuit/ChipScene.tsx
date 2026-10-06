"use client";

// ── ChipScene: composition root ────────────────────────────────────────────
// Assembles the Canvas, lights, board renderer, spark simulation, and camera.
// All behavior logic lives in ChipComponents; all layout lives in circuitLayout.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Scanline, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildBoard } from "./BoardRenderer";
import { createSimulation, SimulationContext } from "./CircuitComponents";
import type { ComponentBehavior } from "./types";
import { BoardRenderer } from "./BoardRenderer";
import { SparkField } from "./SparkField";
import { syncPaletteFromCSS } from "./Devices";
import { useTheme } from "next-themes";

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

// ── Environment synchronization ────────────────────────────────────────────

function SceneEnvironment() {
  const { theme } = useTheme();
  const { scene } = useThree();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const styles = getComputedStyle(document.documentElement);
    const voidColor = styles.getPropertyValue("--color-void").trim() || "#06060f";
    const bg = new THREE.Color(voidColor);
    scene.background = bg;
    scene.fog = new THREE.Fog(bg, 22, 45);
  }, [theme, scene]);

  return null;
}

function VignettePlane({ alphaMap }: { alphaMap: THREE.Texture }) {
  const { theme } = useTheme();
  const [color, setColor] = useState<string>("#06060f");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const styles = getComputedStyle(document.documentElement);
    setColor(styles.getPropertyValue("--color-void").trim() || "#06060f");
  }, [theme]);

  return (
    <mesh position={[0, 0, -2.6]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        color={color}
        metalness={0.65}
        roughness={0.2}
        transparent
        alphaMap={alphaMap}
      />
    </mesh>
  );
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
  const circuit = buildBoard();
  const simulation = useRef(createSimulation());
  const { theme } = useTheme();

  useEffect(() => {
    syncPaletteFromCSS();
    const frame = requestAnimationFrame(() => syncPaletteFromCSS());

    const observer = new MutationObserver(() => syncPaletteFromCSS());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [theme]);

  // Behavior registry: every component self-registers the nodes it answers on.
  const behaviors = useMemo(() => {
    const map = new Map<number, ComponentBehavior>();
    circuit.components.forEach((comp) => {
      comp.behaviorBindings().forEach((node) => map.set(node, comp));
    });

    return map;
  }, [circuit]);

  return (
    <SimulationContext.Provider value={simulation.current}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
        }}
      >
        <SceneEnvironment />

        <ambientLight intensity={0.12} />
        <pointLight position={[0, 0, 8]} intensity={5} color="#ffffff" />
        <directionalLight position={[6, 8, 10]} intensity={0.9} color="#dfe8ff" />

        <Suspense fallback={null}>
          <BoardRenderer />
          <SparkField behaviors={behaviors} />
          <VignettePlane alphaMap={alphaMap} />
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.75}
            luminanceSmoothing={0.9}
            height={300}
            intensity={0.6}
          />
          <Scanline density={1.5} opacity={0.14} />
          <Vignette eskil={false} offset={0.1} darkness={0.55} />
        </EffectComposer>
        <CameraRig />
      </Canvas>
    </SimulationContext.Provider>
  );
}

