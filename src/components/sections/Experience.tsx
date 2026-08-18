import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceNode } from "@/components/ui/ExperienceNode";
import {
  type OtherExperience,
  otherExperiences,
  groupByCategory,
  type ModalId,
} from "@/data";

import { ACCENT_TEXT, type Accent } from "@/lib/accent";

const categoryLabels: Record<OtherExperience["category"], string> = {
  research: "RESEARCH",
  media: "MEDIA & COMMS",
  leadership: "LEADERSHIP",
};

const categoryOrder: OtherExperience["category"][] = ["research", "media", "leadership"];

const categoryAccent: Record<OtherExperience["category"], Accent> = {
  research: "emerald",
  media: "gold",
  leadership: "amethyst",
};

export function Experience({
  onSelectModal,
}: {
  onSelectModal: (key: ModalId) => void;
}) {
  const grouped = groupByCategory(otherExperiences);

  return (
    <section id="Experience" className="py-24 px-4 bg-linear-180 from-bg to-surface">
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_05" title="Other Experience" labelColor="gold" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryOrder.map((cat) => (
            <div key={cat}>
              <div
                className={`mb-2 text-xs tracking-widest opacity-50 ${ACCENT_TEXT[categoryAccent[cat]]}`}
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                {categoryLabels[cat]}
              </div>
              {grouped[cat]?.map((exp) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
