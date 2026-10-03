"use client";

import { useState } from "react";
import { PageSection } from "@/components/ui/PageSection";
import { CompetencyCard } from "@/components/ui/CompetencyCard";
import { coreCompetencies, competencyAreaMeta, competencyAreaOrder } from "@/data";
import type { CompetencyArea } from "@/data/types";
import { ACCENT_CHIP_BORDER, ACCENT_TEXT } from "@/lib/accent";

export function CoreCompetencies() {
  const [activeArea, setActiveArea] = useState<CompetencyArea | null>(null);

  const activeMeta = activeArea ? competencyAreaMeta[activeArea] : null;
  const activeSkills = activeArea ? coreCompetencies.filter((c) => c.area === activeArea).sort((a, b) => b.level - a.level) : [];

  return (
    <PageSection id="Competencies" title="Core Competencies" accent="primary" className="circuit-bg bg-linear-180 from-surface to-surface-2">
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {competencyAreaOrder.map((area) => {
            const meta = competencyAreaMeta[area];
            const skills = coreCompetencies.filter((c) => c.area === area);
            return (
              <CompetencyCard
                key={area}
                label={meta.label}
                accent={meta.accent}
                skills={skills}
                isActive={activeArea === area}
                onToggle={() => setActiveArea(activeArea === area ? null : area)}
              />
            );
          })}
        </div>

        {activeArea && activeMeta && (
          <div className={`hidden md:block w-full chip-card ${ACCENT_CHIP_BORDER[activeMeta.accent]} rounded-lg p-8 transition-all duration-300`}>
             <h4 className={`text-lg font-semibold mb-4 ${ACCENT_TEXT[activeMeta.accent]}`}>
                {activeMeta.label} — All Skills
             </h4>
             <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
               {activeSkills.map((skill) => (
                 <li key={skill.id} className="text-slate-400 text-sm flex justify-between gap-2 border-b border-slate-700/50 pb-1">
                   <div className="flex gap-2">
                     <span className={ACCENT_TEXT[activeMeta.accent]}>▸</span>
                     <span>{skill.name}</span>
                   </div>
                   <span className="opacity-50 text-xs mt-0.5">Lvl {skill.level}</span>
                 </li>
               ))}
             </ul>
          </div>
        )}
      </div>
    </PageSection>
  );
}
