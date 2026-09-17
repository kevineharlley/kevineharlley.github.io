import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillsGrid } from "@/components/sections/SkillsGrid";

export function Skills() {
  return (
    <section id="Skills" className="circuit-bg py-24 px-4 bg-linear-180 from-surface to-surface-2">
      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeading title="Skills &amp; Technologies" />
        <SkillsGrid />
      </div>
    </section>
  );
}
