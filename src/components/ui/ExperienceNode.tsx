const EM = "var(--color-emerald)";

export function ExperienceNode({
  icon, title, subtitle, description, onLearnMore, accent = EM,
}: {
  icon: string; title: string; subtitle?: string; description: string;
  onLearnMore?: () => void; accent?: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 pulse-node"
          style={{ border: `1px solid ${accent}`, background: `rgb(from ${accent} r g b / 0.1)` }}
        >
          <i className={`${icon} text-sm`} style={{ color: accent }} />
        </div>
        <div className="flex-1 w-px mt-2" style={{ background: `rgb(from ${accent} r g b / 0.25)`, minHeight: "24px" }} />
      </div>
      <div className="pb-8">
        <h5 className="font-semibold text-slate-100 text-sm leading-tight">{title}</h5>
        {subtitle && <span className="text-xs text-slate-500 mt-0.5 block">{subtitle}</span>}
        <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-xs">{description}</p>
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="mt-3 text-xs font-medium underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: accent }}
          >
            View Details ?
          </button>
        )}
      </div>
    </div>
  );
}
