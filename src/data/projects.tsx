import type { Project, ModalId } from "./types";

export type { Project, ModalId } from "./types";

export const projects: Project[] = [
  {
    id: "google",
    title: "Google XLS Toolchain",
    image: "/images/google_macbook.png",
    description: (
      <>
        Assisted in coding Google&apos;s XLS toolchain — a high-level language synthesis toolchain for synthesizable
        hardware design.{" "}
        <a href="https://github.com/google/xls" target="_blank" rel="noopener noreferrer" className="text-emerald">
          GitHub →
        </a>
      </>
    ),
    accent: "emerald",
    details: [
      "Wrote Python code for C++ frontend of the Google XLS toolchain.",
      "Worked on the higher-level language synthesis toolchain that allows flexible high-level descriptions of functionality to be changed into synthesizable hardware designs.",
      "Implemented added functionality for translating C++ classes, structs and other operations and language features.",
      "Presented results of work to Google XLS team.",
    ],
  },
  {
    id: "aiEnergy",
    title: "AI Energy Website",
    image: "/images/ai_macbook.png",
    description: (
      <>
        Improved layout and features of the{" "}
        <a href="http://www.aienergygroup.com.gh/" target="_blank" rel="noopener noreferrer" className="text-gold">
          AI Energy Group website
        </a>{" "}
        over the course of one year.
      </>
    ),
    accent: "gold",
    details: [
      "Updated company website including integration of social network feeds and improved user interface.",
      "Managed AI Energy Group's LAN including access control and integration with multiple service providers.",
      "Monitored overall security of AI's systems including physical & logical setups, reviewing change management processes, etc.",
      "Provided technical support to staff to facilitate the day-to-day running of the company.",
      "Maintained operating systems and virtualization platforms, anti-virus programs, emails and cloud storage systems.",
      "Created backup scripts/jobs, reviewed logs, and managed onsite and offsite backups.",
    ],
  },
  {
    id: "vendor-tracking",
    title: "DePauw Senior Project",
    image: "/images/miihor_macbook.png",
    description: "Vendor-tracking system built for my Computer Science major at DePauw University.",
    linkHref: "https://github.com/kevineharlley/Vendor-Tracking",
    linkText: "View on GitHub",
    accent: "amethyst",
  },
  {
    id: "qstodian",
    title: "Qstodian Website",
    image: "/images/qstodian_macbook.png",
    description: (
      <>
        Assisted in developing the Qstodian website for its company launch in 2019.{" "}
        <a href="https://www.qstodian.co/" target="_blank" rel="noopener noreferrer" className="text-emerald">
          qstodian.co →
        </a>
      </>
    ),
    accent: "emerald",
    details: [
      "Designed and developed the company website using WordPress with assistance from the head graphic designer.",
      "Planned and executed the launch of the company and its flagship product, QTotal.",
      "Researched prospective customers and designed the customer development plan.",
      "Programmed key features of the company's tablet software using C++.",
      "Tested the company's externally created management software and provided recommendations to fix bugs and improve performance.",
      "Installed Qstodian's pilot system for various clients and evaluated initial responses and impressions.",
      "Coordinated with the team to contact new customers and set up the company's first three pilots.",
    ],
  },
];
