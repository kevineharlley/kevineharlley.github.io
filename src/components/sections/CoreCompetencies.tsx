import { PageSection } from "@/components/ui/PageSection";
import { CompetencyCard } from "@/components/ui/CompetencyCard";
import { coreCompetencies, competencyAreaMeta, competencyAreaOrder } from "@/data";

export function CoreCompetencies() {
  return (
    <PageSection id="Competencies" title="Core Competencies" accent="primary" className="circuit-bg bg-linear-180 from-surface to-surface-2">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competencyAreaOrder.map((area) => {
            const meta = competencyAreaMeta[area];
            const skills = coreCompetencies.filter((c) => c.area === area);
            return (
              <CompetencyCard
                key={area}
                label={meta.label}
                accent={meta.accent}
                skills={skills}
              />
            );
          })}
        </div>
      </div>
    </PageSection>
  );
}
