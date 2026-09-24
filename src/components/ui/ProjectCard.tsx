"use client";

import { useState } from "react";
import { ACCENT_BG, ACCENT_BG_SOFT, ACCENT_BORDER, ACCENT_CHIP_BORDER, ACCENT_GLOW, ACCENT_HOVER_BG, ACCENT_TEXT, type Accent } from "@/lib/accent";

export function ProjectCard({
  image, title, description, linkHref, linkText, details, accent = "primary",
}: {
  image: string; title: string; description: React.ReactNode;
  linkHref?: string; linkText?: string; details?: string[]; accent?: Accent;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((o) => !o);

  return (
    <div
      className={`chip-card ${ACCENT_CHIP_BORDER[accent]} ${ACCENT_GLOW[accent]} rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 transition-all duration-300 h-full`}
    >
      <div className={`flex items-center justify-center p-6 ${ACCENT_BG_SOFT[accent]}`}>
        <img src={image} alt={title} className="max-w-full max-h-52 object-contain drop-shadow-lg" />
      </div>
      <div className="flex flex-col gap-4 p-8">
        <div className={`w-8 h-px ${ACCENT_BG[accent]}`} />
        <h3 className={`text-2xl font-light ${ACCENT_TEXT[accent]}`}>{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        
        {isOpen && details && details.length > 0 && (
          <div className="mt-2">
            <ul className="space-y-2">
              {details.map((item, i) => (
                <li key={i} className="text-slate-400 text-sm leading-relaxed flex gap-2">
                  <span className={ACCENT_TEXT[accent]}>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-row gap-4 mt-auto justify-end pt-4">
          {details && details.length > 0 && (
            <button
              onClick={toggle}
              className={`flex flex-row items-center px-6 py-2 rounded-full text-sm font-semibold border ${ACCENT_TEXT[accent]} ${ACCENT_BORDER[accent]} ${ACCENT_HOVER_BG[accent]} hover:text-surface transition-colors duration-200`}
            >
              {isOpen ? "Collapse ↑" : "View Details ↓"}
            </button>
          )}
          {linkHref && (
            <a
              href={linkHref} target="_blank" rel="noopener noreferrer"
              className={`flex flex-row items-center px-6 py-2 rounded-full text-sm font-semibold border ${ACCENT_TEXT[accent]} ${ACCENT_BORDER[accent]} transition-colors duration-200`}
            >
              {linkText ?? "View Project"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
