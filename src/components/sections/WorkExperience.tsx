import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { workExperiences } from "@/data/workExperience";

export function WorkExperience() {
  return (
    <section id="WorkExperience" className="py-24 px-4 bg-linear-180 from-surface-2 to-bg">
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_03" title="Work Experience" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workExperiences.map((entry) => (
            <ExperienceCard key={entry.id} {...entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
