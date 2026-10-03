"use client";

import { ACCENT_CHIP_BORDER, ACCENT_TEXT, type Accent } from "@/lib/accent";
import type { CoreCompetency } from "@/data/types";

export function CompetencyCard({
  label,
  accent,
  skills,
  isActive,
  onToggle
}: {
  label: string;
  accent: Accent;
  skills: CoreCompetency[];
  isActive: boolean;
  onToggle: () => void;
}) {
  const sortedSkills = [...skills].sort((a, b) => b.level - a.level);
  // On mobile, if isActive is true, show all. Otherwise show 4. On desktop, we always show 4 because details are shown below the grid.
  const displayedSkills = sortedSkills.slice(0, 4);
  const mobileExpandedSkills = sortedSkills;

  return (
    <div className={`chip-card ${ACCENT_CHIP_BORDER[accent]} rounded-lg p-6 flex flex-col gap-3 relative h-full`}>
      <h4 className={`text-sm font-semibold tracking-wide ${ACCENT_TEXT[accent]}`}>{label}</h4>
      
      {/* Desktop view (always top 4) & Mobile collapsed view */}
      <ul className={`space-y-1.5 transition-all duration-300 ${isActive ? 'hidden md:block' : 'block'}`}>
        {displayedSkills.map((skill) => (
          <li key={skill.id} className="text-slate-400 text-sm flex gap-2">
            <span className={ACCENT_TEXT[accent]}>▸</span>
            <span>{skill.name}</span>
          </li>
        ))}
      </ul>

      {/* Mobile expanded view (all skills) */}
      <ul className={`space-y-1.5 transition-all duration-300 md:hidden ${isActive ? 'block' : 'hidden'}`}>
        {mobileExpandedSkills.map((skill) => (
          <li key={skill.id} className="text-slate-400 text-sm flex gap-2">
            <span className={ACCENT_TEXT[accent]}>▸</span>
            <span>{skill.name}</span>
          </li>
        ))}
      </ul>

      {skills.length > 4 && (
        <button
          onClick={onToggle}
          className={`mt-auto pt-2 text-sm font-medium underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity self-start ${ACCENT_TEXT[accent]}`}
        >
          {isActive ? "Show Less ↑" : `View All (${skills.length}) ↓`}
        </button>
      )}
    </div>
  );
}
