// Structural fingerprint of the built circuit graph.
// The layout is fully deterministic (seeded rng), so identical output before
// and after the component-model refactor proves routing did not change.
// Run: pnpm dlx tsx scripts/fingerprint.ts

import { buildBoard } from "../src/components/circuit/BoardRenderer";

const c = buildBoard();

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return h;
}

// Duck-typed so the same script works on both the old model
// (ResolvedComponent { def: { id, kind } }) and the new one (Component).
/* eslint-disable @typescript-eslint/no-explicit-any */
const compId = (comp: any): string => comp.def?.id ?? comp.id;
const compKind = (comp: any): string => comp.def?.kind ?? comp.kind;

const nodeStr = c.nodes
  .map((n) => `${n.position.join(",")}:${n.type}:${n.layer}:${n.neighbors.length}`)
  .join("|");
const edgeStr = c.edges.map((e) => `${e.from}-${e.to}`).join("|");
const portStr = [...c.portByTerminalNode.entries()]
  .map(([k, p]: [number, any]) => `${k}:${p.device}:${p.side}:${p.lane}:${p.group}`)
  .sort()
  .join("|");
const compStr = c.components
  .map(
    (comp: any) =>
      `${compId(comp)}:${compKind(comp)}:${comp.device}:${comp.node ?? ""}:${comp.layer}:${comp.ports.length}`
  )
  .join("|");

console.log(
  JSON.stringify(
    {
      nodes: c.nodes.length,
      edges: c.edges.length,
      vias: c.vias.length,
      viaLinks: c.viaLinks.length,
      layerNodes: c.layerNodes.map((l: number[]) => l.length),
      layerEdges: c.layerEdges.map((l: unknown[]) => l.length),
      ports: c.portByTerminalNode.size,
      components: c.components.length,
      nodeHash: hash(nodeStr),
      edgeHash: hash(edgeStr),
      portHash: hash(portStr),
      compHash: hash(compStr),
    },
    null,
    2
  )
);
