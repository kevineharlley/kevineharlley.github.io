import { SectionHeading } from "@/components/ui/SectionHeading";
import { EducationCard } from "@/components/ui/EducationCard";
import { AwardBadge } from "@/components/ui/AwardBadge";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { education, awards } from "@/data";

export function Education() {
  return (
    <section id="Education" className="circuit-bg py-24 px-4 bg-linear-180 from-bg to-surface">
      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeading title="Education" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {education.map((entry) => (
            <EducationCard key={entry.id} {...entry} />
          ))}
        </div>
        <CategoryLabel accent="secondary">AWARDS &amp; HONORS</CategoryLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {awards.map((award) => (
            <AwardBadge key={award.id} {...award} />
          ))}
        </div>
      </div>
    </section>
  );
}
