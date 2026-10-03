"use client";

import { useState } from "react";
import { IconType } from "react-icons";
import { ACCENT_BG_SOFT, ACCENT_BORDER, ACCENT_TEXT, type Accent } from "@/lib/accent";

export function ExperienceNode({
  icon: Icon, title, subtitle, description, details, accent = "primary",
}: {
  icon: IconType; title: string; subtitle?: string; description: string;
  details?: string[]; accent?: Accent;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((o) => !o);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 pulse-node border ${ACCENT_BORDER[accent]} ${ACCENT_BG_SOFT[accent]}`}
        >
          {Icon && <Icon className={`text-sm ${ACCENT_TEXT[accent]}`} />}
        </div>
        <div className={`flex-1 w-px mt-2 min-h-6 ${ACCENT_BG_SOFT[accent]}`} />
      </div>
      <div className="pb-8">
        <h5 className="font-semibold text-slate-100 text-sm leading-tight">{title}</h5>
        {subtitle && <span className="text-sm text-slate-400 mt-0.5 block">{subtitle}</span>}
        <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-xs">{description}</p>
        
        {isOpen && details && details.length > 0 && (
          <div className="mt-3 pl-3 border-l-2 border-slate-700/50">
            <ul className="space-y-1.5">
              {details.map((item, i) => (
                <li key={i} className="text-slate-400 text-sm leading-relaxed flex gap-2">
                  <span className={ACCENT_TEXT[accent]}>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {details && details.length > 0 && (
          <button
            onClick={toggle}
            className={`mt-3 text-sm font-medium underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1 ${ACCENT_TEXT[accent]}`}
          >
            {isOpen ? "Collapse ↑" : "View Details ↓"}
          </button>
        )}
      </div>
    </div>
  );
}
