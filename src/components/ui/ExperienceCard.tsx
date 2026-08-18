"use client";

import { useState } from "react";
import type { WorkExperience } from "@/data/workExperience";
import { ACCENT_BG_SOFT, ACCENT_BORDER, ACCENT_CHIP_BORDER, ACCENT_GLOW, ACCENT_TEXT } from "@/lib/accent";

export function ExperienceCard({
  company, role, dateRange, summary, details, logo, icon, accent,
}: WorkExperience) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);

  return (
    <div
      className={`flip-card w-full h-80 cursor-pointer ${flipped ? "is-flipped" : ""} ${ACCENT_GLOW[accent]}`}
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${company} — ${role}. Press to flip for details.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div className="flip-card-inner">
        <div
          className={`flip-card-front chip-card ${ACCENT_CHIP_BORDER[accent]} rounded-lg flex flex-col items-center justify-center gap-3 p-6 text-center`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 border ${ACCENT_BORDER[accent]} ${ACCENT_BG_SOFT[accent]}`}
          >
            {logo ? (
              <img src={logo} alt={`${company} logo`} className="max-w-10 max-h-10 object-contain" />
            ) : (
              <i className={`${icon} text-2xl ${ACCENT_TEXT[accent]}`} />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">{company}</h4>
            <span className="text-xs text-slate-500 mt-0.5 block">{role}</span>
            {dateRange && <span className="text-xs text-slate-600 block">{dateRange}</span>}
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{summary}</p>
          <span className={`text-[0.65rem] font-mono opacity-50 mt-auto tracking-widest ${ACCENT_TEXT[accent]}`}>
            TAP TO FLIP
          </span>
        </div>
        <div
          className={`flip-card-back chip-card ${ACCENT_CHIP_BORDER[accent]} rounded-lg p-6 overflow-y-auto text-left`}
        >
          <h4 className={`font-semibold text-sm mb-3 ${ACCENT_TEXT[accent]}`}>
            {company} — {role}
          </h4>
          <ul className="space-y-2">
            {details.map((item, i) => (
              <li key={i} className="text-slate-400 text-xs leading-relaxed flex gap-2">
                <span className={ACCENT_TEXT[accent]}>▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}