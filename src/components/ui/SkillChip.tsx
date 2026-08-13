const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";
const AM = "var(--color-amethyst)";

export function SkillChip({ icon, name, level, color = EM }: { icon: string; name: string; level: string; color?: string }) {
  const border = color === GO ? "chip-card-gold" : color === AM ? "chip-card-am" : "";
  const badgeBg =
    color === GO
      ? "bg-amber-900/40 text-amber-300"
      : color === AM
      ? "bg-violet-900/40 text-violet-300"
      : "bg-green-900/40 text-green-300";
  return (
    <div
      className={`chip-card ${border} flex flex-col items-center gap-2 p-5 rounded transition-all duration-300 hover:scale-105`}
    >
      <div className="flex gap-1.5 mb-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="block w-0.5 h-2 rounded-full opacity-50" style={{ background: color }} />
        ))}
      </div>
      <i className={`${icon} text-3xl`} style={{ color }} />
      <span className="text-sm font-medium text-center text-slate-200 leading-tight">{name}</span>
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeBg}`}>{level}</span>
      <div className="flex gap-1.5 mt-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="block w-0.5 h-2 rounded-full opacity-50" style={{ background: color }} />
        ))}
      </div>
    </div>
  );
}
