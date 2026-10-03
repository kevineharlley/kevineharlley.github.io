import { FaGraduationCap } from "react-icons/fa";
import { ACCENT_BG_SOFT, ACCENT_BORDER, ACCENT_CHIP_BORDER, ACCENT_TEXT } from "@/lib/accent";
import type { EducationEntry } from "@/data/types";


export function EducationCard({ institution, degree, field, focus, graduationYear, accent, icon: Icon }: EducationEntry) {
  return (
    <div className={`chip-card ${ACCENT_CHIP_BORDER[accent]} rounded-lg p-6 flex flex-col items-center text-center gap-3`}>
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border ${ACCENT_BORDER[accent]} ${ACCENT_BG_SOFT[accent]}`}
      >
        {Icon ? (
          <Icon className={`text-xl ${ACCENT_TEXT[accent]}`} />
        ) : (
          <FaGraduationCap className={`text-xl ${ACCENT_TEXT[accent]}`} />
        )}
      </div>
      <div className="flex flex-col flex-1">
        <h4 className="font-semibold text-slate-100 text-sm">{institution}</h4>
        <p className={`text-sm mt-1 ${ACCENT_TEXT[accent]}`}>{degree}</p>
        <p className="text-slate-400 text-sm mt-1">
          {field}
          {focus ? ` — ${focus}` : ""}
        </p>
        <span className={`text-sm ${ACCENT_TEXT[accent]} opacity-30 block mt-auto pt-1`}>{graduationYear}</span>
      </div>
    </div>
  );
}
