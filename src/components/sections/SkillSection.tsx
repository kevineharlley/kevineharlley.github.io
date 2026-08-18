import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillChip } from "@/components/ui/SkillChip";
import { skills } from "@/data";

export function Skills() {
  return (
    <section id="Skills" className="py-24 px-4 bg-linear-180 from-surface to-surface-2">
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_02" title="Skills &amp; Technologies" labelColor="gold" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <SkillChip key={skill.id} {...skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
