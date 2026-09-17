import type { Accent, Technology, TechGroup } from "./types";

export const techGroupMeta: Record<TechGroup, { label: string; accent: Accent; order: number }> = {
  "coding-languages": { label: "LANGUAGES", accent: "primary", order: 1 },
  "coding-frameworks": { label: "FRAMEWORKS", accent: "primary", order: 2 },
  "coding-cloud": { label: "CLOUD & VERSION CONTROL", accent: "primary", order: 3 },
  hardware: { label: "HARDWARE", accent: "secondary", order: 4 },
  "media-autodesk": { label: "AUTODESK SUITE", accent: "tertiary", order: 5 },
  "media-adobe": { label: "ADOBE SUITE", accent: "tertiary", order: 6 },
  "media-video": { label: "VIDEO & ANIMATION", accent: "tertiary", order: 7 },
  "media-music": { label: "MUSIC PRODUCTION", accent: "tertiary", order: 8 },
  "enterprise-microsoft": { label: "MICROSOFT APPS", accent: "secondary", order: 9 },
  "enterprise-erp": { label: "ERP & CRM", accent: "secondary", order: 10 },
  "enterprise-general": { label: "GENERAL ENTERPRISE", accent: "secondary", order: 11 },
};

export const techGroupOrder: TechGroup[] = (
  Object.entries(techGroupMeta) as [TechGroup, (typeof techGroupMeta)[TechGroup]][]
)
  .sort((a, b) => a[1].order - b[1].order)
  .map(([key]) => key);

export const technologies: Technology[] = [
  // Coding — Languages
  { id: "html", name: "HTML", icon: "fab fa-html5", level: 4, accent: "primary", group: "coding-languages" },
  { id: "css", name: "CSS", icon: "fab fa-css3", level: 4, accent: "primary", group: "coding-languages" },
  { id: "javascript", name: "JavaScript", icon: "fab fa-js", level: 4, accent: "primary", group: "coding-languages" },
  { id: "java", name: "Java", icon: "fab fa-java", level: 3, accent: "primary", group: "coding-languages" },
  { id: "python", name: "Python", icon: "fab fa-python", level: 3, accent: "primary", group: "coding-languages" },
  { id: "cpp", name: "C++", icon: "bi bi-code-slash", level: 3, accent: "primary", group: "coding-languages" },
  { id: "sql", name: "SQL", icon: "fas fa-database", level: 4, accent: "primary", group: "coding-languages" },

  // Coding — Frameworks
  { id: "react", name: "React", icon: "fab fa-react", level: 4, accent: "primary", group: "coding-frameworks" },
  { id: "tailwind", name: "TailwindCSS", icon: "fas fa-wind", level: 4, accent: "primary", group: "coding-frameworks" },
  { id: "r3f", name: "React Three Fiber", icon: "bi bi-badge-3d-fill", level: 3, accent: "primary", group: "coding-frameworks" },
  { id: "nodejs", name: "Node.js", icon: "fab fa-node-js", level: 4, accent: "primary", group: "coding-frameworks" },
  { id: "nextjs", name: "Next.js", icon: "bi bi-hexagon-fill", level: 4, accent: "primary", group: "coding-frameworks" },
  { id: "graphql", name: "GraphQL", icon: "bi bi-diagram-2-fill", level: 3, accent: "primary", group: "coding-frameworks" },
  { id: "threejs", name: "Three.js", icon: "bi bi-badge-3d-fill", level: 3, accent: "primary", group: "coding-frameworks" },
  { id: "angularjs", name: "AngularJS", icon: "fab fa-angular", level: 3, accent: "primary", group: "coding-frameworks" },
  { id: "matlab", name: "MATLAB", icon: "bi bi-graph-up", level: 2, accent: "primary", group: "coding-frameworks" },
  { id: "erlang", name: "Erlang", icon: "bi bi-cpu-fill", level: 2, accent: "primary", group: "coding-frameworks" },

  // Coding — Cloud & Version Control
  { id: "git", name: "Git", icon: "fab fa-git-alt", level: 4, accent: "primary", group: "coding-cloud" },
  { id: "vercel", name: "Vercel", icon: "bi bi-triangle-fill", level: 3, accent: "primary", group: "coding-cloud" },
  { id: "supabase", name: "Supabase", icon: "bi bi-lightning-charge-fill", level: 3, accent: "primary", group: "coding-cloud" },

  // Hardware
  { id: "vhdl", name: "VHDL", icon: "bi bi-cpu-fill", level: 3, accent: "secondary", group: "hardware" },
  { id: "arduino", name: "Arduino", icon: "fab fa-usb", level: 3, accent: "secondary", group: "hardware" },
  { id: "vivado", name: "Vivado", icon: "bi bi-cpu-fill", level: 3, accent: "secondary", group: "hardware" },

  // Media — Autodesk Suite
  { id: "inventor", name: "Inventor", icon: "bi bi-box-fill", level: 3, accent: "tertiary", group: "media-autodesk" },
  { id: "fusion", name: "Fusion 360", icon: "bi bi-box-fill", level: 3, accent: "tertiary", group: "media-autodesk" },
  { id: "autocad", name: "AutoCAD", icon: "bi bi-vector-pen", level: 2, accent: "tertiary", group: "media-autodesk" },
  { id: "vault", name: "Vault", icon: "bi bi-archive-fill", level: 3, accent: "tertiary", group: "media-autodesk" },

  // Media — Adobe Suite
  { id: "photoshop", name: "Photoshop", icon: "fab fa-adobe", level: 3, accent: "tertiary", group: "media-adobe" },
  { id: "fireworks", name: "Fireworks", icon: "fab fa-adobe", level: 2, accent: "tertiary", group: "media-adobe" },
  { id: "after-effects", name: "After Effects", icon: "fab fa-adobe", level: 2, accent: "tertiary", group: "media-adobe" },
  { id: "edge-animate", name: "Edge Animate", icon: "fab fa-adobe", level: 2, accent: "tertiary", group: "media-adobe" },
  { id: "illustrator", name: "Illustrator", icon: "fab fa-adobe", level: 2, accent: "tertiary", group: "media-adobe" },

  // Media — Video & Animation
  { id: "imovie", name: "iMovie", icon: "bi bi-film", level: 3, accent: "tertiary", group: "media-video" },
  { id: "final-cut-pro", name: "Final Cut Pro", icon: "bi bi-film", level: 3, accent: "tertiary", group: "media-video" },
  { id: "blender", name: "Blender", icon: "bi bi-badge-3d-fill", level: 2, accent: "tertiary", group: "media-video" },

  // Media — Music Production
  { id: "ableton", name: "Ableton", icon: "bi bi-music-note-beamed", level: 4, accent: "tertiary", group: "media-music" },
  { id: "audacity", name: "Audacity", icon: "bi bi-soundwave", level: 3, accent: "tertiary", group: "media-music" },
  { id: "maxforlive", name: "Max for Live", icon: "bi bi-sliders", level: 2, accent: "tertiary", group: "media-music" },

  // Enterprise — Microsoft Apps
  { id: "microsoft365", name: "Microsoft 365", icon: "bi bi-microsoft", level: 5, accent: "secondary", group: "enterprise-microsoft" },
  { id: "word", name: "Word", icon: "bi bi-file-earmark-word-fill", level: 5, accent: "secondary", group: "enterprise-microsoft" },
  { id: "powerpoint", name: "PowerPoint", icon: "bi bi-file-earmark-slides-fill", level: 5, accent: "secondary", group: "enterprise-microsoft" },
  { id: "excel", name: "Excel", icon: "bi bi-file-earmark-spreadsheet-fill", level: 5, accent: "secondary", group: "enterprise-microsoft" },
  { id: "powerbi", name: "Power BI", icon: "bi bi-bar-chart-fill", level: 3, accent: "secondary", group: "enterprise-microsoft" },
  { id: "access", name: "Access", icon: "bi bi-database-fill", level: 3, accent: "secondary", group: "enterprise-microsoft" },

  // Enterprise — ERP & CRM
  { id: "sap", name: "SAP", icon: "bi bi-building", level: 3, accent: "secondary", group: "enterprise-erp" },
  { id: "salesforce", name: "Salesforce", icon: "fab fa-salesforce", level: 2, accent: "secondary", group: "enterprise-erp" },
  { id: "configure-one", name: "Configure One CPQ", icon: "bi bi-building", level: 4, accent: "secondary", group: "enterprise-erp" },

  // Enterprise — General
  { id: "tableau", name: "Tableau", icon: "bi bi-bar-chart-fill", level: 3, accent: "secondary", group: "enterprise-general" },
  { id: "figma", name: "Figma", icon: "fab fa-figma", level: 3, accent: "secondary", group: "enterprise-general" },
];
