"use client";

import { useEffect, useState, useRef } from "react";

export function useActiveSectionObserver(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const intersectionRatios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Disconnect any existing observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersectionRatios.current.set(entry.target.id, entry.intersectionRatio);
        });

        let bestId: string | null = null;
        let bestRatio = 0;

        // Iterate through sectionIds to maintain top-to-bottom page order priority.
        // We use >= so that if two sections have identical high intersection ratios 
        // (like when a short bottom section and a tall section are both on screen),
        // the one further down the page is selected.
        sectionIds.forEach((id) => {
          const ratio = intersectionRatios.current.get(id) || 0;
          if (ratio > 0 && ratio >= bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) {
          setActiveSection(bestId);
        }
      },
      { 
        // Small offset to account for the fixed navbar
        rootMargin: "-80px 0px 0px 0px", 
        // Track intersection ratio in 10% increments for smooth active state swapping
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] 
      }
    );

    // Observe all the sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.current?.observe(element);
      }
    });

    // Cleanup on unmount
    return () => observer.current?.disconnect();
  }, [sectionIds]);

  return activeSection;
}
