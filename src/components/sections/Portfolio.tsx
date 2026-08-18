import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects, type ModalId } from "@/data";

export function Portfolio({
  onSelectModal,
}: {
  onSelectModal: (key: ModalId) => void;
}) {
  return (
    <section id="Portfolio" className="py-24 px-4 bg-linear-180 from-surface-2 to-bg">
      <div className="max-w-5xl mx-auto">
        <SectionHeading label=" MODULE_04" title="Portfolio" labelColor="amethyst" />
        <div className="flex flex-col gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onLearnMore={project.details ? () => onSelectModal(project.id) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
