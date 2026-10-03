"use client";

import { Navbar } from "@/components/sections/Navbar";
import { useActiveSectionObserver } from "@/hooks/useActiveSectionObserver";

export function NavigationWrapper({ sections }: { sections: string[] }) {
  const activeSection = useActiveSectionObserver(sections);
  return <Navbar activeSection={activeSection} />;
}
