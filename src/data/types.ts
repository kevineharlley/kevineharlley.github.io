import type { ReactNode } from "react";
import type { Accent } from "@/lib/accent";

export type { Accent } from "@/lib/accent";

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  accent: Accent;
  category?: "frontend" | "backend" | "tools" | "languages" | "design";
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  dateRange?: string;
  summary: string;
  details: string[];
  logo?: string;
  icon?: string;
  accent: Accent;
}

export interface OtherExperience {
  id: string;
  category: "research" | "media" | "leadership";
  title: string;
  subtitle?: string;
  description: string;
  details: string[];
  icon: string;
  accent: Accent;
}

export interface Project {
  id: string;
  title: string;
  description: ReactNode;
  image: string;
  linkHref?: string;
  linkText?: string;
  accent: Accent;
  details?: string[];
}

export type ModalId = WorkExperience["id"] | OtherExperience["id"] | Project["id"];

export type OtherExperienceCategory = OtherExperience["category"];
