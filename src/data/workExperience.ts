import type { WorkExperience } from "./types";

export type { WorkExperience } from "./types";

export const workExperiences: WorkExperience[] = [
  {
    id: "hafele",
    company: "Hafele",
    role: "Configuration Engineer/Developer",
    dateRange: "January 2023 — Present",
    summary:
      "Own the Configure-to-Order workstream as administrator/developer for Configure One CPQ and SAP Variant Article, supporting $20M+ in annual configurable product sales.",
    details: [
      "Own the Configure-to-Order (CTO) workstream, serving as administrator/developer for Configure One CPQ, SAP Variant Article, and supporting data tools to process more than $20M in annual configurable product sales while ensuring configuration accuracy and alignment between customer requirements and production capabilities.",
      "Partnered with IT, external security consultants and business stakeholders to restore the company's configuration systems following a global cyber-attack, enabling recovery of critical Configure-to-Order operations in under 6 months after the legacy infrastructure had been decommissioned and sanitized.",
      "Designed and implemented custom enhancements to Configure One CPQ using JavaScript, HTML and CSS, extending vendor-provided functionality to support business requirements and streamline configuration workflows.",
      "Partnered with Category Managers, engineering and production teams to translate complex engineering and manufacturing rules into interactive configuration experiences, supporting product launches that generated more than $5M in sales.",
      "Collaborated with global business and technology teams on the transition to a unified global configuration platform, consolidating multiple fragmented systems while reducing total annual platform costs by more than 88%.",
      "Served as administrator and primary business owner for the company's Configure-To-Order platform, managing access and support for more than 3,000 internal and external users while maintaining configuration accuracy rates exceeding 90%.",
      "Streamlined configuration development and testing processes by designing reusable configuration frameworks and templates, reducing implementation effort and shortening deployment timelines for new product launches.",
      "Led configuration design reviews and requirement-gathering as subject matter expert for Configure One CPQ and SAP Variant Article, supporting the global Configuration Platform Strategy across multiple regions and business units.",
    ],
    icon: "bi bi-building",
    accent: "quarternary",
  },
  {
    id: "deloitte",
    company: "Deloitte",
    role: "Solutions Engineering Analyst",
    dateRange: "September 2021 — January 2023",
    summary:
      "Supported two global ERP/CPQ implementation programs valued at $5M+ each, leading requirements, Agile delivery and reporting workstreams.",
    details: [
      "Supported two global ERP (Oracle CPQ and Salesforce) implementation programs valued at more than $5M each, collaborating with cross-functional stakeholders from early-stage discovery through deployment and hyper care.",
      "Gathered, analyzed and documented functional requirements for customer system implementations, ensuring alignment of business processes, pricing logic and reporting capabilities across global operations.",
      "Developed end-to-end business process flows mapping current-state and future-state processes, use cases and system interaction diagrams, identifying opportunities for optimization and automation.",
      "Served as lead for the Reporting & Analytics workstream on a global ERP implementation, driving requirement definition, feature prioritization and stakeholder alignment throughout the delivery lifecycle.",
      "Coordinated and facilitated Agile ceremonies including standups, backlog grooming, sprint planning and retrospectives, promoting adherence to Deloitte delivery methodologies.",
      "Managed a backlog of more than 600 user stories, partnering with offshore development teams to perform functional, integration and user acceptance testing across more than 100 system features.",
      "Conducted client-facing demonstrations during sprint reviews, gathering stakeholder feedback and facilitating iterative refinement throughout the development lifecycle.",
    ],
    icon: "bi bi-triangle",
    accent: "tertiary",
  },
  {
    id: "google",
    company: "Google",
    role: "Software Engineering Intern",
    dateRange: "May 2020 — August 2020",
    summary:
      "Contributed to the Google XLS hardware synthesis toolchain used to translate high-level logic into synthesizable designs.",
    details: [
      "Contributed to Google's high-level synthesis (HLS) compiler toolchain XLS, developing Python-based tooling that transformed high-level software representations into synthesizable hardware descriptions.",
      "Designed and executed functional validation and regression testing for XLS toolchain features, identifying bugs across multiple stages of the hardware synthesis workflow.",
      "Designed and implemented support for C++ struct and class translation within the XLS frontend, expanding language compatibility for the hardware synthesis pipeline.",
      "Participated in peer code reviews and source control management using GitHub, contributing production-quality code aligned with Google's engineering standards.",
      "Independently designed, implemented, tested and delivered production-ready enhancements throughout the software development lifecycle.",
    ],
    icon: "bi bi-google",
    accent: "primary",
  },
  {
    id: "qstodian",
    company: "Qstodian",
    role: "Technology & Strategy Consultant",
    dateRange: "May 2019 — August 2019",
    summary:
      "Helped launch Qstodian's flagship product, QTotal, from website design through first customer pilots.",
    details: [
      "Worked directly with founders, stakeholders and engineering to build and launch a technology product from concept to market, aligning on functionality, branding and customer experience.",
      "Built and maintained the company's public-facing website using WordPress, collaborating with the head graphic designer to translate brand guidelines into a functional site.",
      "Supported go-to-market planning, execution and launch activities for the company's flagship product lines, QTotal, QSend and QSelect.",
      "Designed, developed and tested production software features for the company's tablet-based solution using C++, contributing to core user experience and operational capabilities.",
      "Performed functional testing and quality assurance across proprietary software platforms, identifying defects and validating performance improvements prior to release.",
      "Contributed to the development of smart facility management solutions providing occupancy analytics and operational insights for commercial facilities.",
    ],
    logo: "/images/qstodianlogo.png",
    accent: "tertiary",
  },
  {
    id: "mediaIntern",
    company: "Washington University in St. Louis",
    role: "Media Services Intern",
    dateRange: "August 2018 — March 2019",
    summary:
      "Ran live production for campus events, managing broadcast, control room technology and post-production editing.",
    details: [
      "Coordinated technical operations for live campus events, managing audio, video, projection and control room technologies to ensure successful delivery of academic and campus-wide events.",
      "Served as technical lead for event broadcasting, supporting livestream production, recording workflows and signal routing during live events where downtime was not an option.",
      "Produced and edited digital media content using Final Cut Pro and Adobe tools, transforming raw event recordings into polished deliverables for university communications.",
      "Collaborated with faculty, staff, guest speakers and event organizers to identify technical requirements and ensure successful event execution.",
      "Diagnosed and resolved audio, video, projection and connectivity issues during live events, minimizing disruptions and maintaining production quality.",
    ],
    icon: "bi bi-camera-reels",
    accent: "primary",
  },
  {
    id: "aiEnergy",
    company: "AI Energy Group",
    role: "Information Technology Intern",
    dateRange: "August 2017 — August 2018",
    summary: "Managed IT infrastructure, security, and technical support across AI Energy Group's systems.",
    details: [
      "Maintained and enhanced the company website using HTML, CSS and WordPress, improving usability, content delivery and customer engagement.",
      "Assisted in coordinating internal audit activities supporting the organization's preparation for ISO14001 environmental management certification.",
      "Managed day-to-day operations of critical technology infrastructure, including virtualization environments, cloud storage platforms and endpoint security solutions.",
      "Delivered technical support for staff, troubleshooting hardware, software, network and electronic equipment issues to minimize downtime.",
      "Assisted in the administration of information security and governance practices, conducting security reviews and supporting change management procedures.",
      "Owned backup and disaster recovery operations, including automated job scheduling, log review, recovery validation and onsite/offsite data protection strategies.",
    ],
    logo: "/images/ai.png",
    accent: "secondary",
  },
  {
    id: "associate",
    company: "DePauw University",
    role: "Information Technology Associate",
    dateRange: "August 2014 — May 2017",
    summary:
      "Supported a campus-wide network transformation project and delivered front-line IT support for faculty, staff and students.",
    details: [
      "Participated in a large-scale campus network transformation project, supporting the planning, deployment and upgrade of infrastructure to improve connectivity and scalability.",
      "Developed comprehensive network infrastructure documentation using Microsoft Visio for 14 university facilities, mapping component locations for planning activities.",
      "Installed, configured and deployed networking hardware throughout campus facilities as part of a university-wide infrastructure modernization project.",
      "Managed the lifecycle of university technology assets through refurbishment, reimaging, repair and redeployment, ensuring environmentally responsible disposal of retired equipment.",
      "Served as a front-line technical support resource for faculty, troubleshooting desktop, laptop, software, networking and audiovisual technology issues.",
      "Maintained technology asset inventories including computers, peripherals, networking devices and A/V equipment to support procurement and deployment planning.",
    ],
    icon: "bi bi-hdd-network",
    accent: "primary",
  },
  {
    id: "research",
    company: "DePauw University",
    role: "Science Research Fellow",
    dateRange: "August 2014 — May 2017",
    summary:
      "Designed a Java/MySQL EEG data collection and analysis pipeline to research brainwave-based biometric authentication.",
    details: [
      "Designed and implemented components of a Java-based EEG data collection program that presented controlled visual stimuli to elicit brainwave activity captured into structured datasets.",
      "Developed the backend data model supporting EEG research activities, creating database structures linking brainwave recordings to experimental stimuli using MySQL.",
      "Developed software for signal correlation and pattern comparison across EEG datasets, supporting research into brainwave-based biometric authentication.",
      "Communicated complex technical research findings to diverse audiences through formal presentations and poster sessions.",
      "Contributed to the design and execution of controlled experiments intended to measure and compare individual brainwave patterns.",
    ],
    icon: "bi bi-cpu",
    accent: "secondary",
  },
];
