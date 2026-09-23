"use client";

import { useEffect, useState, useRef } from "react";

export function useActiveSectionObserver(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Disconnect any existing observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // The section is considered "active" if 50% of it is visible.
      // The rootMargin pushes the observation boundary up, so we catch the
      // section header as it enters the middle of the screen.
      { rootMargin: "-30% 0px -40% 0px", threshold: 0.5 }
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
