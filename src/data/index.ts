export * from "./types";
export { workExperiences, type WorkExperience } from "./workExperience";
export { skills } from "./skills";
export { otherExperiences } from "./otherExperience";
export { projects } from "./projects";

import type { WorkExperience, OtherExperience, Project, ModalId } from "./types";
import { workExperiences } from "./workExperience";
import { otherExperiences } from "./otherExperience";
import { projects } from "./projects";

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
} as Record<ModalId, { title: string; items: string[] }>;

export function groupByCategory<T extends { category: string }>(items: T[]): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
