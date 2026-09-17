import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceNode } from "@/components/ui/ExperienceNode";
import { otherExperiences, type ModalId } from "@/data";

export function Leadership({
  onSelectModal,
}: {
  onSelectModal: (key: ModalId) => void;
}) {
  return (
    <section id="Leadership" className="circuit-bg py-24 px-4 bg-linear-180 from-bg to-surface">
      <div className="relative z-10 max-w-3xl mx-auto">
        <SectionHeading title="Leadership" />
        <div>
          {otherExperiences.map((exp) => (
            <ExperienceNode
              key={exp.id}
              icon={exp.icon}
              title={exp.title}
              subtitle={exp.subtitle}
              description={exp.description}
              onLearnMore={() => onSelectModal(exp.id)}
              accent={exp.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
