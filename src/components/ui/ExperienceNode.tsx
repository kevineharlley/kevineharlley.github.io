import { ACCENT_BG_SOFT, ACCENT_BORDER, ACCENT_TEXT, type Accent } from "@/lib/accent";

export function ExperienceNode({
  icon, title, subtitle, description, onLearnMore, accent = "emerald",
}: {
  icon: string; title: string; subtitle?: string; description: string;
  onLearnMore?: () => void; accent?: Accent;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 pulse-node border ${ACCENT_BORDER[accent]} ${ACCENT_BG_SOFT[accent]}`}
        >
          <i className={`${icon} text-sm ${ACCENT_TEXT[accent]}`} />
        </div>
        <div className={`flex-1 w-px mt-2 ${ACCENT_BG_SOFT[accent]}`} style={{ minHeight: "24px" }} />
      </div>
      <div className="pb-8">
        <h5 className="font-semibold text-slate-100 text-sm leading-tight">{title}</h5>
        {subtitle && <span className="text-xs text-slate-500 mt-0.5 block">{subtitle}</span>}
        <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-xs">{description}</p>
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className={`mt-3 text-xs font-medium underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity ${ACCENT_TEXT[accent]}`}
          >
            View Details ?
          </button>
        )}
      </div>
    </div>
  );
}
