"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SkillChip } from "@/components/ui/SkillChip";
import { technologies, techGroupMeta, techGroupOrder, type TechGroup } from "@/data";
import { ACCENT_BG, ACCENT_BORDER, ACCENT_HOVER_BG, ACCENT_TEXT, type Accent } from "@/lib/accent";

export function SkillsGrid() {
  // Empty array = "All" groups shown; otherwise multi-select filter of active groups.
  const [activeGroups, setActiveGroups] = useState<TechGroup[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tracks horizontal scroll position to disable the prev/next buttons at each end.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Filter by active groups (if any), then rank most-proficient skills first.
  const visibleTechs = useMemo(() => {
    const filtered =
      activeGroups.length === 0
        ? technologies
        : technologies.filter((tech) => activeGroups.includes(tech.group));
    return [...filtered].sort((a, b) => b.level - a.level);
  }, [activeGroups]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  // Jump back to the start whenever the filtered set changes.
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0 });
    updateScrollState();
  }, [visibleTechs]);

  // Toggling a group adds/removes it from the multi-select filter.
  function toggleGroup(group: TechGroup) {
    setActiveGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  }

  // Scrolls by one viewport-width "page" instead of true pagination (DOM stays mounted).
  function scrollPage(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * scrollRef.current.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      {/* "All" pill + one toggle pill per technology group. */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill label="ALL" accent="primary" active={activeGroups.length === 0} onClick={() => setActiveGroups([])} />
        {techGroupOrder.map((group) => {
          const meta = techGroupMeta[group];
          return (
            <FilterPill
              key={group}
              label={meta.label}
              accent={meta.accent}
              active={activeGroups.includes(group)}
              onClick={() => toggleGroup(group)}
            />
          );
        })}
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="scroll-h overflow-x-auto scroll-smooth pb-2"
      >
        {/* grid-flow-col + fixed 4 rows fills each column top-to-bottom, then flows
            rightward — keeps ~16 chips visible on desktop while scrolling horizontally. */}
        <div className="grid grid-flow-col grid-rows-4 auto-cols-68 gap-4">
          {visibleTechs.map((tech) => (
            <SkillChip key={tech.id} {...tech} />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={() => scrollPage(-1)}
          disabled={atStart}
          aria-label="Scroll to previous skills"
          className="w-9 h-9 rounded-full border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
        >
          <i className="bi bi-chevron-left" />
        </button>
        <button
          type="button"
          onClick={() => scrollPage(1)}
          disabled={atEnd}
          aria-label="Scroll to more skills"
          className="w-9 h-9 rounded-full border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
}

// Pill-style toggle button for a single group filter (or the "All" reset).
function FilterPill({
  label, active, accent, onClick,
}: { label: string; active: boolean; accent: Accent; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs tracking-widest border font-mono transition-colors duration-200 ${
        active
          ? `${ACCENT_BG[accent]} text-black border-transparent`
          : `bg-transparent ${ACCENT_TEXT[accent]} ${ACCENT_BORDER[accent]} ${ACCENT_HOVER_BG[accent]} hover:text-black`
      }`}
    >
      {label}
    </button>
  );
}
