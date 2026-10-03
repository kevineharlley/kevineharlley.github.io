"use client";

import dynamic from "next/dynamic";

export const ClientChipScene = dynamic(
  () => import("@/components/circuit/ChipScene").then((m) => m.ChipScene),
  { ssr: false }
);
