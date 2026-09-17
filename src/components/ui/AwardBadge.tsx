import { ACCENT_CHIP_BORDER, ACCENT_TEXT } from "@/lib/accent";
import type { Award } from "@/data/types";

export function AwardBadge({ title, organization, accent, icon }: Award) {
  return (
    <div className={`chip-card ${ACCENT_CHIP_BORDER[accent]} rounded-lg px-4 py-3 flex items-center gap-3`}>
      <i className={`${icon ?? "bi bi-award-fill"} text-lg shrink-0 ${ACCENT_TEXT[accent]}`} />
      <div>
        <span className="text-sm text-slate-200 block leading-tight">{title}</span>
        {organization && <span className="text-xs text-slate-500">{organization}</span>}
      </div>
    </div>
  );
}
