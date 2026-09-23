import { PageSection } from "@/components/ui/PageSection";
import { SkillsGrid } from "@/components/sections/SkillsGrid";

export function Skills() {
  return (
    <PageSection id="Skills" title="Skills & Technologies" accent="primary" className="circuit-bg bg-linear-180 from-surface to-surface-2">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SkillsGrid />
      </div>
    </PageSection>
  );
}
