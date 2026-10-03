"use client";

import { PageSection } from "@/components/ui/PageSection";
import { ExperienceNode } from "@/components/ui/ExperienceNode";
import { otherExperiences } from "@/data";

export function Leadership() {
  return (
    <PageSection id="Leadership" title="Leadership" accent="tertiary" className="circuit-bg bg-linear-180 from-bg to-surface">
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start">
          {otherExperiences.map((exp) => (
            <ExperienceNode
              key={exp.id}
              icon={exp.icon}
              title={exp.title}
              subtitle={exp.subtitle}
              description={exp.description}
              details={exp.details}
              accent={exp.accent}
            />
          ))}
        </div>
      </div>
    </PageSection>
  );
}
