import { PageSection } from "@/components/ui/PageSection";
import { EducationCard } from "@/components/ui/EducationCard";
import { AwardBadge } from "@/components/ui/AwardBadge";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { education, awards } from "@/data";

export function Education() {
  return (
    <PageSection id="Education" title="Education" accent="secondary" className="circuit-bg bg-linear-180 from-bg to-surface">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {education.map((entry) => (
            <EducationCard key={entry.id} {...entry} />
          ))}
        </div>
        <CategoryLabel accent="quarternary">AWARDS & HONORS</CategoryLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {awards.map((award) => (
            <AwardBadge key={award.id} {...award} />
          ))}
        </div>
      </div>
    </PageSection>
  );
}
