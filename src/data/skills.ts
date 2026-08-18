import type { Skill } from "./types";

export const skills: Skill[] = [
  { id: "css", name: "CSS", icon: "fab fa-css3", level: 5, accent: "emerald", category: "frontend" },
  { id: "java", name: "Java", icon: "fab fa-java", level: 5, accent: "emerald", category: "languages" },
  { id: "office", name: "Microsoft Office", icon: "fab fa-windows", level: 5, accent: "emerald", category: "tools" },
  { id: "python", name: "Python", icon: "fab fa-python", level: 5, accent: "gold", category: "languages" },
  { id: "creative-suite", name: "Adobe Creative Suite", icon: "fas fa-video", level: 4, accent: "gold", category: "design" },
  { id: "ajax", name: "Ajax", icon: "fas fa-code", level: 4, accent: "gold", category: "frontend" },
  { id: "mysql", name: "MySQL", icon: "fas fa-database", level: 4, accent: "amethyst", category: "backend" },
  { id: "php", name: "PHP", icon: "fab fa-php", level: 4, accent: "amethyst", category: "backend" },
];
