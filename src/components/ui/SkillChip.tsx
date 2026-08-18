import { ACCENT_BG, ACCENT_BG_SOFT, ACCENT_CHIP_BORDER, ACCENT_TEXT, type Accent } from "@/lib/accent";

export function SkillChip({
  icon, name, level, accent = "emerald",
}: { icon: string; name: string; level: number; accent?: Accent }) {
  return (
    <div
      className={`chip-card ${ACCENT_CHIP_BORDER[accent]} flex flex-col items-center gap-2 p-5 rounded transition-all duration-300 hover:scale-105`}
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`block w-3.5 h-2 rounded-xs ${
              i < level ? ACCENT_BG[accent] : "bg-slate-700"
            }`}
          />
        ))}
      </div>
      <i className={`${icon} text-3xl ${ACCENT_TEXT[accent]}`} />
      <span className="text-sm font-medium text-center text-slate-200 leading-tight">{name}</span>
      
    </div>
  );
}
