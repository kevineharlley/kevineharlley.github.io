import { PageSection } from "@/components/ui/PageSection";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { workExperiences } from "@/data";

export function WorkExperience() {
  return (
    <PageSection id="WorkExperience" title="Work Experience" accent="secondary" className="circuit-bg bg-linear-180 from-surface-2 to-bg">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workExperiences.map((entry) => (
            <ExperienceCard key={entry.id} {...entry} />
          ))}
        </div>
      </div>
    </PageSection>
  );
}
