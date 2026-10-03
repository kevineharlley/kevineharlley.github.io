import { FaAward } from "react-icons/fa";
import { ACCENT_CHIP_BORDER, ACCENT_TEXT } from "@/lib/accent";
import type { Award } from "@/data/types";


export function AwardBadge({ title, organization, accent, icon: Icon }: Award) {
  return (
    <div className={`chip-card ${ACCENT_CHIP_BORDER[accent]} rounded-lg px-4 py-3 flex items-center gap-3`}>
      {Icon ? (
        <Icon className={`text-lg shrink-0 ${ACCENT_TEXT[accent]}`} />
      ) : (
        <FaAward className={`text-lg shrink-0 ${ACCENT_TEXT[accent]}`} />
      )}
      <div>
        <span className="text-sm text-slate-200 block leading-tight">{title}</span>
        {organization && <span className="text-sm text-slate-400">{organization}</span>}
      </div>
    </div>
  );
}
