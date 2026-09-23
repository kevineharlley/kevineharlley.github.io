import { ACCENT_CHIP_BORDER, ACCENT_TEXT, type Accent } from "@/lib/accent";
import type { CoreCompetency } from "@/data/types";

export function CompetencyCard({
  label,
  accent,
  skills,
  onViewAll,
}: {
  label: string;
  accent: Accent;
  skills: CoreCompetency[];
  onViewAll: () => void;
}) {
  const top = [...skills].sort((a, b) => b.level - a.level).slice(0, 4);
  return (
    <div className={`chip-card ${ACCENT_CHIP_BORDER[accent]} rounded-lg p-6 flex flex-col gap-3 h-full`}>
      <h4 className={`text-sm font-semibold tracking-wide ${ACCENT_TEXT[accent]}`}>{label}</h4>
      <ul className="space-y-1.5">
        {top.map((skill) => (
          <li key={skill.id} className="text-slate-400 text-sm flex gap-2">
            <span className={ACCENT_TEXT[accent]}>▸</span>
            <span>{skill.name}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onViewAll}
        className={`mt-auto text-sm font-medium underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity self-start ${ACCENT_TEXT[accent]}`}
      >
        View All ({skills.length}) →
      </button>
    </div>
  );
}
