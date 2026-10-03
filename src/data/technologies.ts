import { FaAngular, FaArchive, FaBolt, FaBox, FaBuilding, FaChartBar, FaChartLine, FaCode, FaCss3, FaCube, FaDatabase, FaDiceD6, FaFigma, FaFileExcel, FaFilePowerpoint, FaFileWord, FaFilm, FaGitAlt, FaHtml5, FaJava, FaJs, FaMicrochip, FaMicrosoft, FaMusic, FaNodeJs, FaPalette, FaPenNib, FaPlay, FaProjectDiagram, FaPython, FaReact, FaSalesforce, FaSlidersH, FaUsb, FaWaveSquare, FaWind } from "react-icons/fa";
import type { Accent, Technology, TechGroup } from "./types";



export const techGroupMeta: Record<TechGroup, { label: string; accent: Accent; order: number }> = {
  "coding-languages": { label: "LANGUAGES", accent: "primary", order: 1 },
  "coding-frameworks": { label: "FRAMEWORKS", accent: "primary", order: 2 },
  "coding-cloud": { label: "CLOUD & VERSION CONTROL", accent: "primary", order: 3 },
  hardware: { label: "HARDWARE", accent: "secondary", order: 4 },
  "enterprise-microsoft": { label: "MICROSOFT APPS", accent: "secondary", order: 5 },
  "enterprise-erp": { label: "ERP & CRM", accent: "secondary", order: 6 },
  "enterprise-general": { label: "GENERAL ENTERPRISE", accent: "secondary", order: 7 },
  "media-autodesk": { label: "AUTODESK SUITE", accent: "tertiary", order: 8 },
  "media-adobe": { label: "ADOBE SUITE", accent: "tertiary", order: 9 },
  "media-video": { label: "VIDEO & ANIMATION", accent: "tertiary", order: 10 },
  "media-music": { label: "MUSIC PRODUCTION", accent: "tertiary", order: 11 },
};

export const techGroupOrder: TechGroup[] = (
  Object.entries(techGroupMeta) as [TechGroup, (typeof techGroupMeta)[TechGroup]][]
)
  .sort((a, b) => a[1].order - b[1].order)
  .map(([key]) => key);

export const technologies: Technology[] = [
  // Coding — Languages
  { id: "html", name: "HTML", icon: FaHtml5, level: 4, accent: "primary", group: "coding-languages", brandColor: "#E44D26" },
  { id: "css", name: "CSS", icon: FaCss3, level: 4, accent: "primary", group: "coding-languages", brandColor: "#3B82F6" },
  { id: "javascript", name: "JavaScript", icon: FaJs, level: 4, accent: "primary", group: "coding-languages", brandColor: "#F7DF1E" },
  { id: "java", name: "Java", icon: FaJava, level: 3, accent: "primary", group: "coding-languages", brandColor: "#FFAA33" },
  { id: "python", name: "Python", icon: FaPython, level: 3, accent: "primary", group: "coding-languages", brandColor: "#4B8BBE" },
  { id: "cpp", name: "C++", icon: FaCode, level: 3, accent: "primary", group: "coding-languages", brandColor: "#659AD2" },
  { id: "sql", name: "SQL", icon: FaDatabase, level: 4, accent: "primary", group: "coding-languages", brandColor: "#6FA2C5" },

  // Coding — Frameworks
  { id: "react", name: "React", icon: FaReact, level: 4, accent: "primary", group: "coding-frameworks", brandColor: "#61DAFB" },
  { id: "tailwind", name: "TailwindCSS", icon: FaWind, level: 4, accent: "primary", group: "coding-frameworks", brandColor: "#38B2AC" },
  { id: "r3f", name: "React Three Fiber", icon: FaCube, level: 3, accent: "primary", group: "coding-frameworks" },
  { id: "nodejs", name: "Node.js", icon: FaNodeJs, level: 4, accent: "primary", group: "coding-frameworks", brandColor: "#53B453" },
  { id: "nextjs", name: "Next.js", icon: FaDiceD6, level: 4, accent: "primary", group: "coding-frameworks", brandColor: "#EAEAEA" },
  { id: "graphql", name: "GraphQL", icon: FaProjectDiagram, level: 3, accent: "primary", group: "coding-frameworks", brandColor: "#F244B6" },
  { id: "threejs", name: "Three.js", icon: FaCube, level: 3, accent: "primary", group: "coding-frameworks", brandColor: "#EAEAEA" },
  { id: "angularjs", name: "AngularJS", icon: FaAngular, level: 3, accent: "primary", group: "coding-frameworks", brandColor: "#E83B5E" },
  { id: "matlab", name: "MATLAB", icon: FaChartLine, level: 2, accent: "primary", group: "coding-frameworks", brandColor: "#ED6B67" },
  { id: "erlang", name: "Erlang", icon: FaMicrochip, level: 2, accent: "primary", group: "coding-frameworks", brandColor: "#CA3661" },

  // Coding — Cloud & Version Control
  { id: "git", name: "Git", icon: FaGitAlt, level: 4, accent: "primary", group: "coding-cloud", brandColor: "#F05032" },
  { id: "vercel", name: "Vercel", icon: FaPlay, level: 3, accent: "primary", group: "coding-cloud", brandColor: "#EAEAEA" },
  { id: "supabase", name: "Supabase", icon: FaBolt, level: 3, accent: "primary", group: "coding-cloud", brandColor: "#3ECF8E" },

  // Hardware
  { id: "vhdl", name: "VHDL", icon: FaMicrochip, level: 3, accent: "secondary", group: "hardware" },
  { id: "arduino", name: "Arduino", icon: FaUsb, level: 3, accent: "secondary", group: "hardware", brandColor: "#30BDBD" },
  { id: "vivado", name: "Vivado", icon: FaMicrochip, level: 3, accent: "secondary", group: "hardware" },

  // Media — Autodesk Suite
  { id: "inventor", name: "Inventor", icon: FaBox, level: 3, accent: "tertiary", group: "media-autodesk", brandColor: "#FFC220" },
  { id: "fusion", name: "Fusion 360", icon: FaBox, level: 3, accent: "tertiary", group: "media-autodesk", brandColor: "#F26522" },
  { id: "autocad", name: "AutoCAD", icon: FaPenNib, level: 2, accent: "tertiary", group: "media-autodesk", brandColor: "#E52E2D" },
  { id: "vault", name: "Vault", icon: FaArchive, level: 3, accent: "tertiary", group: "media-autodesk" },

  // Media — Adobe Suite
  { id: "photoshop", name: "Photoshop", icon: FaPalette, level: 3, accent: "tertiary", group: "media-adobe", brandColor: "#31A8FF" },
  { id: "fireworks", name: "Fireworks", icon: FaPalette, level: 2, accent: "tertiary", group: "media-adobe" },
  { id: "after-effects", name: "After Effects", icon: FaPalette, level: 2, accent: "tertiary", group: "media-adobe", brandColor: "#9999FF" },
  { id: "edge-animate", name: "Edge Animate", icon: FaPalette, level: 2, accent: "tertiary", group: "media-adobe" },
  { id: "illustrator", name: "Illustrator", icon: FaPalette, level: 2, accent: "tertiary", group: "media-adobe", brandColor: "#FF9A00" },

  // Media — Video & Animation
  { id: "imovie", name: "iMovie", icon: FaFilm, level: 3, accent: "tertiary", group: "media-video", brandColor: "#B55DF5" },
  { id: "final-cut-pro", name: "Final Cut Pro", icon: FaFilm, level: 3, accent: "tertiary", group: "media-video" },
  { id: "blender", name: "Blender", icon: FaCube, level: 2, accent: "tertiary", group: "media-video", brandColor: "#EA7600" },

  // Media — Music Production
  { id: "ableton", name: "Ableton", icon: FaMusic, level: 4, accent: "tertiary", group: "media-music" },
  { id: "audacity", name: "Audacity", icon: FaWaveSquare, level: 3, accent: "tertiary", group: "media-music", brandColor: "#2A76CE" },
  { id: "maxforlive", name: "Max for Live", icon: FaSlidersH, level: 2, accent: "tertiary", group: "media-music" },

  // Enterprise — Microsoft Apps
  { id: "microsoft365", name: "Microsoft 365", icon: FaMicrosoft, level: 5, accent: "secondary", group: "enterprise-microsoft", brandColor: "#EAEAEA" },
  { id: "word", name: "Word", icon: FaFileWord, level: 5, accent: "secondary", group: "enterprise-microsoft", brandColor: "#4F85CF" },
  { id: "powerpoint", name: "PowerPoint", icon: FaFilePowerpoint, level: 5, accent: "secondary", group: "enterprise-microsoft", brandColor: "#D66A4E" },
  { id: "excel", name: "Excel", icon: FaFileExcel, level: 5, accent: "secondary", group: "enterprise-microsoft", brandColor: "#3B9862" },
  { id: "powerbi", name: "Power BI", icon: FaChartBar, level: 3, accent: "secondary", group: "enterprise-microsoft", brandColor: "#F2C811" },
  { id: "access", name: "Access", icon: FaDatabase, level: 3, accent: "secondary", group: "enterprise-microsoft", brandColor: "#A4373A" },

  // Enterprise — ERP & CRM
  { id: "sap", name: "SAP", icon: FaBuilding, level: 3, accent: "secondary", group: "enterprise-erp", brandColor: "#35ACEC" },
  { id: "salesforce", name: "Salesforce", icon: FaSalesforce, level: 2, accent: "secondary", group: "enterprise-erp", brandColor: "#00A1E0" },
  { id: "configure-one", name: "Configure One CPQ", icon: FaBuilding, level: 4, accent: "secondary", group: "enterprise-erp" },

  // Enterprise — General
  { id: "tableau", name: "Tableau", icon: FaChartBar, level: 3, accent: "secondary", group: "enterprise-general", brandColor: "#E97627" },
  { id: "figma", name: "Figma", icon: FaFigma, level: 3, accent: "secondary", group: "enterprise-general", brandColor: "#A259FF" },
];
