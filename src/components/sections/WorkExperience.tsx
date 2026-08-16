import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { experienceData } from "@/data/experienceData";

export function WorkExperience() {
  return (
    <section id="WorkExperience" className="py-24 px-4" style={{ background: "linear-gradient(180deg,#131328 0%,#0d0d1e 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_03" title="Work Experience" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experienceData.map((entry) => (
            <ExperienceCard key={entry.id} {...entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
