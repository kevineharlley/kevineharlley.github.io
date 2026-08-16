import { ACCENT_BG, ACCENT_BG_SOFT, ACCENT_CHIP_BORDER, ACCENT_TEXT, type Accent } from "@/lib/accent";

export function SkillChip({
  icon, name, level, accent = "emerald",
}: { icon: string; name: string; level: string; accent?: Accent }) {
  return (
    <div
      className={`chip-card ${ACCENT_CHIP_BORDER[accent]} flex flex-col items-center gap-2 p-5 rounded transition-all duration-300 hover:scale-105`}
    >
      <div className="flex gap-1.5 mb-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`block w-0.5 h-2 rounded-full opacity-50 ${ACCENT_BG[accent]}`} />
        ))}
      </div>
      <i className={`${icon} text-3xl ${ACCENT_TEXT[accent]}`} />
      <span className="text-sm font-medium text-center text-slate-200 leading-tight">{name}</span>
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ACCENT_TEXT[accent]} ${ACCENT_BG_SOFT[accent]}`}>{level}</span>
      <div className="flex gap-1.5 mt-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`block w-0.5 h-2 rounded-full opacity-50 ${ACCENT_BG[accent]}`} />
        ))}
      </div>
    </div>
  );
}
