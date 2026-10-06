"use client";

// ── BoardRenderer: static circuit board geometry ───────────────────────────
// Renders traces, vias, and device meshes from the layout graph. No simulation
// logic here — purely presentational, rebuilt only if the circuit changes.

import { useMemo, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { BoardBuilder, LAYER_COUNT, LAYER_SPACING, type Circuit } from "./circuitLayout";
import { DeviceFactory } from "./Devices";
import { ComponentMesh } from "./circuitComponents";

// ── Board director ─────────────────────────────────────────────────────────
// BoardRenderer directs construction: devices from the DeviceFactory, routed
// and built by the BoardBuilder. One cached instance shared by all consumers.

let cachedBoard: Circuit | null = null;

export function buildBoard(): Circuit {
  if (!cachedBoard) {
    cachedBoard = new BoardBuilder()
      .withDevices(DeviceFactory.createBoardSet())
      .route()
      .build();
  }
  return cachedBoard;
}

// For HMR or testing: reset the cached board
export function resetBoard(): void {
  cachedBoard = null;
}

function themeColor(varName: string): THREE.Color {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return new THREE.Color(value || "#ffffff");
}

// Palette tokens are either hex literals or CSS variable names.
function resolveColor(token: string): THREE.Color {
  return token.startsWith("#") ? new THREE.Color(token) : themeColor(token);
}

function rng(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Multilayer stack ───────────────────────────────────────────────────────
// Layer 0 is the real board (z = 0, carries components + sparks).
// Layers 1..6 are REAL subgraphs from circuitLayout (own node space, connected
// by via links), so what renders is exactly what sparks can traverse.

const LAYER_COLOR_VARS = [
  "--color-traces",              // layer 0: copper (top signal)
  "--color-tertiary",     // emerald
  "--color-quarternary",  // teal
  "--color-primary",      // gold
  "--color-secondary",    // amethyst
  "--color-quinary",      // quinary accent
  "--color-quarternary",  // teal
] as const;

// ── WireField: traces as round 3D wires ────────────────────────────────────
// One instanced cylinder per graph edge (surface, inner layers, via shafts)
// plus a joint sphere at every via/bend so bundles read as soldered wire.

const WIRE_RADIUS = 0.008;
const JOINT_RADIUS = 0.02;

// Depth falloff inside the crystal: deeper layers dimmer.
function layerDim(layer: number): number {
  return layer === 0 ? 1 : 0.92 - layer * 0.07;
}

function WireField() {
  const { theme } = useTheme();
  const circuit = buildBoard();
  const wireRef = useRef<THREE.InstancedMesh>(null);
  const jointRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const wires = wireRef.current;
    if (!wires) return;
    const tmp = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const color = new THREE.Color();

    circuit.edges.forEach((edge, i) => {
      const na = circuit.nodes[edge.from];
      const nb = circuit.nodes[edge.to];
      a.set(...na.position);
      b.set(...nb.position);
      dir.subVectors(b, a);
      const len = Math.max(dir.length(), 1e-4);
      tmp.position.copy(a).addScaledVector(dir, 0.5);
      tmp.quaternion.setFromUnitVectors(up, dir.normalize());
      tmp.scale.set(WIRE_RADIUS, len, WIRE_RADIUS);
      tmp.updateMatrix();
      wires.setMatrixAt(i, tmp.matrix);
      const layer = Math.max(na.layer, nb.layer);
      color
        .copy(resolveColor(LAYER_COLOR_VARS[layer]))
        .multiplyScalar(layerDim(layer));
      wires.setColorAt(i, color);
    });
    wires.instanceMatrix.needsUpdate = true;
    if (wires.instanceColor) wires.instanceColor.needsUpdate = true;
  }, [circuit, theme]);

  useEffect(() => {
    const joints = jointRef.current;
    if (!joints) return;
    const tmp = new THREE.Object3D();
    const color = new THREE.Color();

    circuit.vias.forEach((nodeId, i) => {
      const node = circuit.nodes[nodeId];
      tmp.position.set(...node.position);
      tmp.scale.setScalar(JOINT_RADIUS);
      tmp.updateMatrix();
      joints.setMatrixAt(i, tmp.matrix);
      color
        .copy(resolveColor(LAYER_COLOR_VARS[node.layer]))
        .multiplyScalar(layerDim(node.layer));
      joints.setColorAt(i, color);
    });
    joints.instanceMatrix.needsUpdate = true;
    if (joints.instanceColor) joints.instanceColor.needsUpdate = true;
  }, [circuit, theme]);

  return (
    <>
      <instancedMesh
        ref={wireRef}
        args={[undefined, undefined, Math.max(circuit.edges.length, 1)]}
        frustumCulled={false}
      >
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.35} />
      </instancedMesh>
      <instancedMesh
        ref={jointRef}
        args={[undefined, undefined, Math.max(circuit.vias.length, 1)]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.35} />
      </instancedMesh>
    </>
  );
}

// ── Crystal strata: one tinted dielectric sheet per layer ──────────────────

function LayerSheets() {
  const { theme } = useTheme();
  const sheetMatRefs = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);

  useEffect(() => {
    for (let i = 0; i < LAYER_COUNT; i++) {
      const mat = sheetMatRefs.current[i];
      if (!mat) continue;
      mat.color.copy(themeColor(LAYER_COLOR_VARS[i]));
    }
  }, [theme]);

  return (
    <>
      {Array.from({ length: LAYER_COUNT }, (_, i) => (
        <mesh
          key={`sheet-${i}`}
          position={[0, 0, -0.06 - i * LAYER_SPACING - LAYER_SPACING / 2]}
        >
          <planeGeometry args={[17.4, 9.9]} />
          <meshPhysicalMaterial
            ref={(m) => {
              sheetMatRefs.current[i] = m;
            }}
            transparent
            opacity={0.10}
            depthWrite={false}
            metalness={0}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}


// ── Device meshes ──────────────────────────────────────────────────────────

function CircuitComponents() {
  const circuit = buildBoard();
  const { theme } = useTheme();

  return (
    <>
      {circuit.components.map((comp, index) => (
        <ComponentMesh key={`${comp.id}-${comp.instanceKey}-${index}`} component={comp} />
      ))}
    </>
  );
}

// ── Board base ─────────────────────────────────────────────────────────────

function useEngravedBoardTextures(boardColor: string): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  return useMemo(() => {
    const w = 2048;
    const h = 1170; // matches the 17.5 × 10 plane aspect
    const text = "KEVIN EYRAM HARLLEY";
    const font = "600 170px 'Geist Mono', ui-monospace, monospace";

    // Color map: board fill + engraved name
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = w;
    colorCanvas.height = h;
    const cctx = colorCanvas.getContext("2d")!;

    // Color map: faint tint + engraved name (alpha canvas — no solid fill)
    cctx.clearRect(0, 0, w, h);
    cctx.fillStyle = boardColor;
    cctx.globalAlpha = 0.18;              // whisper of solder-mask color
    cctx.fillRect(0, 0, w, h);
    cctx.globalAlpha = 1;
    cctx.textAlign = "center";
    cctx.textBaseline = "middle";
    cctx.font = font;

    // bevel highlight (offset down-right), then the dark cut
    cctx.fillStyle = "rgba(255,255,255,0.14)";   // bevel highlight
    cctx.fillText(text, w / 2, h * 0.62 + 5);
    cctx.fillStyle = "rgba(0,0,0,0.75)";          // deeper, darker cut
    cctx.fillText(text, w / 2, h * 0.62 - 2);
    cctx.fillStyle = "rgba(255,255,255,0.25)";          // cyan edge-lightt
    cctx.fillText(text, w / 2 - 3, h * 0.62 + 3);
    const map = new THREE.CanvasTexture(colorCanvas);
    map.colorSpace = THREE.SRGBColorSpace;

    // Roughness map: letters are rougher than the glossy solder mask,
    // so they catch light differently — this is what sells "engraved".
    const roughCanvas = document.createElement("canvas");
    roughCanvas.width = w;
    roughCanvas.height = h;
    const rctx = roughCanvas.getContext("2d")!;
    rctx.fillStyle = "#595959"; // base roughness ≈ 0.35
    rctx.fillRect(0, 0, w, h);
    rctx.textAlign = "center";
    rctx.textBaseline = "middle";
    rctx.font = font;
    rctx.fillStyle = "#d9d9d9"; // letters ≈ 0.85 roughness
    rctx.fillText(text, w / 2, h / 2);
    const roughnessMap = new THREE.CanvasTexture(roughCanvas);

    return { map, roughnessMap };
  }, [boardColor]);
}

function BoardBase() {
  const { theme } = useTheme();
  // Resolve after theme flips so getComputedStyle sees the new token
  const boardColor = useMemo(() => {
    if (typeof window === "undefined") return "#0b4453";
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-board")
        .trim() || "#0b4453"
    );
  }, [theme]);

  const { map, roughnessMap } = useEngravedBoardTextures(boardColor);
  const depth = LAYER_COUNT * LAYER_SPACING; // slab spans the whole stack

  return (
    <mesh position={[0, 0, -0.05 - depth / 2]}>
      <boxGeometry args={[17.5, 10, depth]} />
      {/* boxGeometry face order: +x, -x, +y, -y, +z (top), -z (bottom) */}
      <meshPhysicalMaterial
        attach="material-0"
        map={map}
        roughnessMap={roughnessMap}
        transparent
        opacity={0.55}
        depthWrite={false}
        roughness={1}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
      <meshPhysicalMaterial
        attach="material-1"
        map={map}
        roughnessMap={roughnessMap}
        transparent
        opacity={0.55}
        depthWrite={false}
        roughness={1}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
      <meshPhysicalMaterial
        attach="material-2"
        map={map}
        roughnessMap={roughnessMap}
        transparent
        opacity={0.55}
        depthWrite={false}
        roughness={1}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
      <meshPhysicalMaterial
        attach="material-3"
        map={map}
        roughnessMap={roughnessMap}
        transparent
        opacity={0.55}
        depthWrite={false}
        roughness={1}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
      <meshPhysicalMaterial
        attach="material-4"
        map={map}
        roughnessMap={roughnessMap}
        transparent
        opacity={0.55}
        depthWrite={false}
        roughness={1}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
      <meshPhysicalMaterial
        attach="material-5"
        map={map}
        roughnessMap={roughnessMap}
        transparent
        opacity={0.55}
        depthWrite={false}
        roughness={1}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
    </mesh>
  );
}

// ── Exported composition ───────────────────────────────────────────────────

export function BoardRenderer() {
  return (
    <>
      <BoardBase />
      <LayerSheets />
      <WireField />
      <CircuitComponents />
    </>
  );
}
