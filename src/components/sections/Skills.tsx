import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillChip } from "@/components/ui/SkillChip";

const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";
const AM = "var(--color-amethyst)";

export function Skills() {
  return (
    <section id="Skills" className="py-24 px-4" style={{ background: "linear-gradient(180deg,#0d0d1e 0%,#131328 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_02" title="Skills &amp; Technologies" labelColor={GO} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <SkillChip icon="fab fa-css3" name="CSS" level="Expert" color={EM} />
          <SkillChip icon="fab fa-java" name="Java" level="Expert" color={EM} />
          <SkillChip icon="fab fa-windows" name="Microsoft Office" level="Expert" color={EM} />
          <SkillChip icon="fab fa-python" name="Python" level="Expert" color={GO} />
          <SkillChip icon="fas fa-video" name="Adobe Creative Suite" level="Expert" color={GO} />
          <SkillChip icon="fas fa-code" name="Ajax" level="Proficient" color={GO} />
          <SkillChip icon="fas fa-database" name="MySQL" level="Proficient" color={AM} />
          <SkillChip icon="fab fa-php" name="PHP" level="Proficient" color={AM} />
        </div>
      </div>
    </section>
  );
}
