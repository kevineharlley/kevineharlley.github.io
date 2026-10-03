"use client";

import { useState } from "react";
import { PageSection } from "@/components/ui/PageSection";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { workExperiences } from "@/data";
import { ACCENT_CHIP_BORDER, ACCENT_TEXT } from "@/lib/accent";

// Helper to chunk the array into rows of 3
const chunkArray = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export function WorkExperience() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const rows = chunkArray(workExperiences, 3);

  return (
    <PageSection id="WorkExperience" title="Work Experience" accent="secondary" className="circuit-bg bg-linear-180 from-surface-2 to-bg">
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-6">
        {rows.map((row, rowIndex) => {
          const activeItemInRow = row.find((item) => item.id === activeId);

          return (
            <div key={rowIndex} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {row.map((entry) => (
                  <ExperienceCard
                    key={entry.id}
                    {...entry}
                    isActive={activeId === entry.id}
                    onToggle={() => setActiveId(activeId === entry.id ? null : entry.id)}
                  />
                ))}
              </div>
              
              {activeItemInRow && (
                <div className={`hidden md:block w-full chip-card ${ACCENT_CHIP_BORDER[activeItemInRow.accent]} rounded-lg p-8 transition-all duration-300`}>
                  <div className="flex items-center gap-4 mb-4">
                    {activeItemInRow.logo ? (
                      <img src={activeItemInRow.logo} alt="logo" className="max-w-8 max-h-8 object-contain" />
                    ) : (
                      <i className={`${activeItemInRow.icon} text-xl ${ACCENT_TEXT[activeItemInRow.accent]}`} />
                    )}
                    <h4 className={`text-lg font-semibold ${ACCENT_TEXT[activeItemInRow.accent]}`}>
                      {activeItemInRow.company} — {activeItemInRow.role}
                    </h4>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {activeItemInRow.details.map((item, i) => (
                      <li key={i} className="text-slate-400 text-sm leading-relaxed flex gap-2">
                        <span className={ACCENT_TEXT[activeItemInRow.accent]}>▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageSection>
  );
}
