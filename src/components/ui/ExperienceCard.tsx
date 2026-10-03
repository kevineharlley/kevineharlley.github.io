"use client";

import type { WorkExperience } from "@/data/workExperience";
import { ACCENT_BG_SOFT, ACCENT_BORDER, ACCENT_CHIP_BORDER, ACCENT_GLOW, ACCENT_TEXT } from "@/lib/accent";

import Image from "next/image";

interface ExperienceCardProps extends WorkExperience {
  isActive: boolean;
  onToggle: () => void;
}

export function ExperienceCard({
  company, role, dateRange, summary, details, logo, icon: Icon, accent, isActive, onToggle
}: ExperienceCardProps) {
  return (
    <div
      className={`chip-card ${ACCENT_CHIP_BORDER[accent]} ${ACCENT_GLOW[accent]} rounded-lg flex flex-col gap-3 p-6 text-left transition-all duration-300 w-full relative h-full`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border ${ACCENT_BORDER[accent]} ${ACCENT_BG_SOFT[accent]}`}
        >
          {logo ? (
            <Image src={logo} alt={`${company} logo`} width={32} height={32} className="max-w-8 max-h-8 object-contain" unoptimized />
          ) : (
            Icon && <Icon className={`text-xl ${ACCENT_TEXT[accent]}`} />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-slate-100">{company}</h4>
          <span className={`text-md mt-0.5 block ${ACCENT_TEXT[accent]} opacity-80`}>{role}</span>
          {dateRange && <span className="text-sm text-slate-400 block">{dateRange}</span>}
        </div>
      </div>
      
      <p className="text-slate-400 text-sm leading-relaxed mt-2">{summary}</p>
      
      <div className={`mt-4 pt-4 border-t border-slate-700/50 md:hidden ${isActive ? "block" : "hidden"}`}>
        <ul className="space-y-2">
          {details.map((item, i) => (
            <li key={i} className="text-slate-400 text-sm leading-relaxed flex gap-2">
              <span className={ACCENT_TEXT[accent]}>▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto pt-4">
        <button
          onClick={onToggle}
          className={`text-sm font-medium underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity ${ACCENT_TEXT[accent]}`}
          aria-expanded={isActive}
        >
          {isActive ? "Collapse ↑" : "View Details ↓"}
        </button>
      </div>
    </div>
  );
}