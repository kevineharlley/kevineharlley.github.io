import type { Accent, CompetencyArea, CoreCompetency } from "./types";

export const competencyAreaMeta: Record<CompetencyArea, { label: string; accent: Accent; order: number }> = {
  leadership: { label: "LEADERSHIP & ENTREPRENEURSHIP", accent: "tertiary", order: 1 },
  product: { label: "PRODUCT & SOFTWARE DEVELOPMENT", accent: "primary", order: 2 },
  consulting: { label: "CONSULTING & BUSINESS ANALYSIS", accent: "secondary", order: 3 },
  itops: { label: "TECHNICAL SUPPORT & IT OPERATIONS", accent: "primary", order: 4 },
  research: { label: "RESEARCH & ANALYTICS", accent: "tertiary", order: 5 },
};

export const competencyAreaOrder: CompetencyArea[] = (
  Object.entries(competencyAreaMeta) as [CompetencyArea, (typeof competencyAreaMeta)[CompetencyArea]][]
)
  .sort((a, b) => a[1].order - b[1].order)
  .map(([key]) => key);

export const coreCompetencies: CoreCompetency[] = [
  // Leadership & Entrepreneurship
  { id: "technology-strategy", name: "Technology Strategy", level: 5, area: "leadership" },
  { id: "strategic-planning", name: "Strategic Planning", level: 4, area: "leadership" },
  { id: "executive-communication", name: "Executive Communication", level: 4, area: "leadership" },
  { id: "entrepreneurship", name: "Entrepreneurship", level: 3, area: "leadership" },
  { id: "startup-operations", name: "Startup Operations", level: 3, area: "leadership" },
  { id: "startup-consulting-experience", name: "Startup Consulting Experience", level: 4, area: "leadership" },
  { id: "business-growth-initiatives", name: "Business Growth Initiatives", level: 4, area: "leadership" },
  { id: "entrepreneurship-ecosystem-participation", name: "Entrepreneurship Ecosystem Participation", level: 3, area: "leadership" },
  { id: "global-business-environments", name: "Global Business Environments", level: 5, area: "leadership" },
  { id: "cross-functional-collaboration", name: "Cross-Functional Collaboration", level: 5, area: "leadership" },
  { id: "stakeholder-communication", name: "Stakeholder Communication", level: 4, area: "leadership" },

  // Product & Software Development
  { id: "software-development", name: "Software Development", level: 4, area: "product" },
  { id: "agile-development", name: "Agile Development", level: 4, area: "product" },
  { id: "product-delivery", name: "Product Delivery", level: 4, area: "product" },
  { id: "product-management", name: "Product Management", level: 4, area: "product" },
  { id: "testing-deployment", name: "Testing & Deployment", level: 3, area: "product" },
  { id: "code-review", name: "Code Review", level: 3, area: "product" },
  { id: "engineering-collaboration", name: "Engineering Collaboration", level: 3, area: "product" },
  { id: "large-scale-software-engineering", name: "Large-Scale Software Engineering", level: 4, area: "product" },
  { id: "cloud-technologies", name: "Cloud Technologies", level: 3, area: "product" },
  { id: "product-thinking", name: "Product Thinking", level: 5, area: "product" },
  { id: "solution-architecture", name: "Solution Architecture", level: 4, area: "product" },
  { id: "product-strategy", name: "Product Strategy", level: 4, area: "product" },
  { id: "product-configuration", name: "Product Configuration", level: 5, area: "product" },
  { id: "system-customization", name: "System Customization", level: 3, area: "product" },
  { id: "debugging", name: "Debugging", level: 4, area: "product" },
  { id: "business-rule-implementation", name: "Business Rule Implementation", level: 4, area: "product" },

  // Consulting & Business Analysis
  { id: "technology-consulting", name: "Technology Consulting", level: 4, area: "consulting" },
  { id: "enterprise-consulting", name: "Enterprise Consulting", level: 4, area: "consulting" },
  { id: "business-analysis", name: "Business Analysis", level: 4, area: "consulting" },
  { id: "financial-analysis", name: "Financial Analysis", level: 4, area: "consulting" },
  { id: "process-improvement", name: "Process Improvement", level: 4, area: "consulting" },
  { id: "requirements-analysis", name: "Requirements Analysis", level: 4, area: "consulting" },
  { id: "stakeholder-management", name: "Stakeholder Management", level: 4, area: "consulting" },
  { id: "client-engagement", name: "Client Engagement", level: 4, area: "consulting" },
  { id: "digital-transformation", name: "Digital Transformation", level: 4, area: "consulting" },
  { id: "strategic-technology-planning", name: "Strategic Technology Planning", level: 4, area: "consulting" },
  { id: "technology-advisory", name: "Technology Advisory", level: 4, area: "consulting" },
  { id: "system-implementation", name: "System Implementation", level: 4, area: "consulting" },
  { id: "business-technology-alignment", name: "Business Technology Alignment", level: 4, area: "consulting" },
  { id: "client-solutions", name: "Client Solutions", level: 4, area: "consulting" },
  { id: "requirement-translation", name: "Requirement Translation", level: 4, area: "consulting" },
  { id: "business-process-analysis", name: "Business Process Analysis", level: 4, area: "consulting" },

  // Technical Support & IT Operations
  { id: "it-support", name: "IT Support", level: 5, area: "itops" },
  { id: "technical-troubleshooting", name: "Technical Troubleshooting", level: 5, area: "itops" },
  { id: "incident-management", name: "Incident Management", level: 4, area: "itops" },
  { id: "systems-administration", name: "Systems Administration", level: 5, area: "itops" },
  { id: "enterprise-it-operations", name: "Enterprise IT Operations", level: 4, area: "itops" },
  { id: "infrastructure-support", name: "Infrastructure Support", level: 4, area: "itops" },
  { id: "infrastructure-operations", name: "Infrastructure Operations", level: 4, area: "itops" },
  { id: "system-automation", name: "System Automation", level: 4, area: "itops" },
  { id: "business-systems", name: "Business Systems", level: 4, area: "itops" },
  { id: "solution-configuration", name: "Solution Configuration", level: 3, area: "itops" },
  { id: "network-administration", name: "Network Administration", level: 3, area: "itops" },
  { id: "enterprise-systems", name: "Enterprise Systems", level: 4, area: "itops" },
  { id: "technology-deployment", name: "Technology Deployment", level: 4, area: "itops" },
  { id: "user-enablement", name: "User Enablement", level: 4, area: "itops" },
  { id: "configuration-management", name: "Configuration Management", level: 3, area: "itops" },
  { id: "software-implementation", name: "Software Implementation", level: 4, area: "itops" },
  { id: "operational-support", name: "Operational Support", level: 4, area: "itops" },

  // Research & Analytics
  { id: "research-support", name: "Research Support", level: 3, area: "research" },
  { id: "research-methodology", name: "Research Methodology", level: 3, area: "research" },
  { id: "data-collection", name: "Data Collection", level: 4, area: "research" },
  { id: "data-analysis", name: "Data Analysis", level: 4, area: "research" },
  { id: "technical-analysis", name: "Technical Analysis", level: 4, area: "research" },
  { id: "technical-writing", name: "Technical Writing", level: 5, area: "research" },
  { id: "experimental-processes", name: "Experimental Processes", level: 3, area: "research" },
  { id: "scientific-collaboration", name: "Scientific Collaboration", level: 2, area: "research" },
  { id: "documentation", name: "Documentation", level: 4, area: "research" },
];
