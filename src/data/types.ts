import type { ReactNode } from "react";
import type { Accent } from "@/lib/accent";

export type { Accent } from "@/lib/accent";

export type TechGroup =
  | "coding-languages"
  | "coding-frameworks"
  | "coding-cloud"
  | "hardware"
  | "media-autodesk"
  | "media-adobe"
  | "media-video"
  | "media-music"
  | "enterprise-microsoft"
  | "enterprise-erp"
  | "enterprise-general";

export interface Technology {
  id: string;
  name: string;
  icon: string;
  level: number;
  accent: Accent;
  group: TechGroup;
}

export type CompetencyArea = "leadership" | "product" | "consulting" | "itops" | "research";

export interface CoreCompetency {
  id: string;
  name: string;
  level: number;
  area: CompetencyArea;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  focus?: string;
  graduationYear: string;
  accent: Accent;
  icon?: string;
}

export interface Award {
  id: string;
  title: string;
  organization?: string;
  accent: Accent;
  icon?: string;
}

export interface ContactInfo {
  phone: string;
  phoneHref: string;
  email: string;
  linkedin: string;
  website: string;
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
  category: "leadership";
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

export type ModalId =
  | WorkExperience["id"]
  | OtherExperience["id"]
  | Project["id"]
  | `competency-${CompetencyArea}`;
