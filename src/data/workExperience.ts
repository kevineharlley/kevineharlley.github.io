import type { WorkExperience } from "./types";

export type { WorkExperience } from "./types";

export const workExperiences: WorkExperience[] = [
  {
    id: "hafele",
    company: "Hafele",
    role: "Configuration Engineer/Developer",
    summary:
      "Managed Hafele's Configuration-To-Order Process and developed automated workflows to speed up the process",
    details: [
      "Managed the company’s Configure-to-Order process by leveraging Software tools such as ConfigureOne CPQ, SAP Variant Article and Microsoft Excel.",
      "Coordinated with the IT team to stand up the company’s Configuration system after a global cyber-attack.",
    ],
    icon: "bi bi-building",
    accent: "gold",
  },
  {
    id: "deloitte",
    company: "Deloitte",
    role: "Solutions Engineering Analyst",
    summary:
      "Worked as an analyst on large CPQ and ERP implementation projects.",
    details: [
      "Created process flows for various of features and functionality across architectural landscape of solution system.",
      "Managed daily standup meetings and ensured team adhered to company’s standard Agile principles and practices.",
      "Wrote, groomed, and managed implementation of over 600 user stories for client projects.",
      "Tested functionality for over 100 features in digital system and assessed quality of product created by an offshore team.",
    ],
    icon: "bi bi-triangle",
    accent: "amethyst",
  },
  {
    id: "google",
    company: "Google",
    role: "Software Engineering Intern",
    summary:
      "Contributed to the Google XLS hardware synthesis toolchain used to translate high-level logic into synthesizable designs.",
    details: [
      "Wrote Python code for the C++ frontend of the Google XLS toolchain.",
      "Worked on the higher-level language synthesis toolchain that allows flexible high-level descriptions of functionality to be changed into synthesizable hardware designs.",
      "Implemented added functionality for translating C++ classes, structs and other operations and language features.",
      "Presented results of work to the Google XLS team.",
    ],
    icon: "bi bi-google",
    accent: "emerald",
  },
  {
    id: "qstodian",
    company: "Qstodian",
    role: "Technology & Strategy Consultant",
    summary:
      "Helped launch Qstodian's flagship product, QTotal, from website design through first customer pilots.",
    details: [
      "Designed and developed the company website using WordPress with assistance from the head graphic designer.",
      "Planned and executed the launch of the company and its flagship product, QTotal.",
      "Researched prospective customers and designed the customer development plan.",
      "Programmed key features of the company's tablet software using C++.",
      "Tested the company's externally created management software and provided recommendations to fix bugs and improve performance.",
      "Installed Qstodian's pilot system for various clients and evaluated initial responses and impressions.",
      "Coordinated with the team to contact new customers and set up the company's first three pilots.",
    ],
    logo: "/images/qstodianlogo.png",
    accent: "gold",
  },
  {
    id: "aiEnergy",
    company: "AI Energy Group",
    role: "Information Technology Intern",
    summary: "Managed IT infrastructure, security, and technical support across AI Energy Group's systems.",
    details: [
      "Updated company website including integration of social network feeds and improved user interface.",
      "Managed AI Energy Group's LAN including access control and integration with multiple service providers.",
      "Monitored overall security of AI's systems including physical & logical setups, reviewing change management processes, etc.",
      "Provided technical support to staff to facilitate the day-to-day running of the company.",
      "Maintained operating systems and virtualization platforms, anti-virus programs, emails and cloud storage systems.",
      "Created backup scripts/jobs, reviewed logs, and managed onsite and offsite backups.",
    ],
    logo: "/images/ai.png",
    accent: "amethyst",
  },
];
