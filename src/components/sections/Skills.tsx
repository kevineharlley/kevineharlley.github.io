import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillChip } from "@/components/ui/SkillChip";

export function Skills() {
  return (
    <section id="Skills" className="py-24 px-4" style={{ background: "linear-gradient(180deg,#0d0d1e 0%,#131328 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_02" title="Skills &amp; Technologies" labelColor="gold" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <SkillChip icon="fab fa-css3" name="CSS" level="Expert" accent="emerald" />
          <SkillChip icon="fab fa-java" name="Java" level="Expert" accent="emerald" />
          <SkillChip icon="fab fa-windows" name="Microsoft Office" level="Expert" accent="emerald" />
          <SkillChip icon="fab fa-python" name="Python" level="Expert" accent="gold" />
          <SkillChip icon="fas fa-video" name="Adobe Creative Suite" level="Expert" accent="gold" />
          <SkillChip icon="fas fa-code" name="Ajax" level="Proficient" accent="gold" />
          <SkillChip icon="fas fa-database" name="MySQL" level="Proficient" accent="amethyst" />
          <SkillChip icon="fab fa-php" name="PHP" level="Proficient" accent="amethyst" />
        </div>
      </div>
    </section>
  );
}
