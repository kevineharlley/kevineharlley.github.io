export * from "./types";
export { workExperiences, type WorkExperience } from "./workExperience";
export { technologies, techGroupMeta, techGroupOrder } from "./technologies";
export { coreCompetencies, competencyAreaMeta, competencyAreaOrder } from "./coreCompetencies";
export { otherExperiences } from "./otherExperience";
export { projects } from "./projects";
export { education } from "./education";
export { awards } from "./awards";
export { contactInfo, narrative } from "./profile";

import type { WorkExperience, OtherExperience, Project, ModalId, CompetencyArea } from "./types";
import { workExperiences } from "./workExperience";
import { otherExperiences } from "./otherExperience";
import { projects } from "./projects";
import { coreCompetencies, competencyAreaMeta, competencyAreaOrder } from "./coreCompetencies";

export const modalRegistry: Record<ModalId, { title: string; items: string[] }> = {
  ...Object.fromEntries(
    workExperiences.map((e) => [e.id, { title: `${e.company} — ${e.role}`, items: e.details }])
  ),
  ...Object.fromEntries(
    otherExperiences.map((e) => [e.id, { title: e.title, items: e.details }])
  ),
  ...Object.fromEntries(
    projects.filter((p): p is Project & { details: string[] } => !!p.details).map((p) => [
      p.id,
      { title: p.title, items: p.details },
    ])
  ),
  ...Object.fromEntries(
    competencyAreaOrder.map((area: CompetencyArea) => [
      `competency-${area}`,
      {
        title: competencyAreaMeta[area].label,
        items: coreCompetencies
          .filter((c) => c.area === area)
          .sort((a, b) => b.level - a.level)
          .map((c) => `${c.name} — Level ${c.level}/5`),
      },
    ])
  ),
} as Record<ModalId, { title: string; items: string[] }>;
