import { PageSection } from "@/components/ui/PageSection";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects, type ModalId } from "@/data";
import { Reveal } from "../ui/Reveal";

export function Portfolio({
  onSelectModal,
}: {
  onSelectModal: (key: ModalId) => void;
}) {
  return (
    <PageSection id="Portfolio" title="Portfolio" accent="primary" className="circuit-bg bg-linear-180 from-surface-2 to-bg">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
              <ProjectCard
                {...project}
                onLearnMore={project.details ? () => onSelectModal(project.id) : undefined}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
