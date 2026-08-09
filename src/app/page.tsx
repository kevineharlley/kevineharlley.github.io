"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

// ─── Reusable sub-components ────────────────────────────────────────────────

function SkillItem({
  icon,
  name,
  level,
}: {
  icon: string;
  name: string;
  level: string;
}) {
  return (
    <div className="flex flex-col items-center pt-8">
      <i className={`${icon} fa-3x text-primary`} />
      <h5 className="text-center mt-2 font-medium text-gray-800">{name}</h5>
      <span className="mt-1 inline-block bg-primary text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
        {level}
      </span>
    </div>
  );
}

function PortfolioItem({
  image,
  imageRounded,
  title,
  description,
  linkHref,
  linkText,
  onLearnMore,
}: {
  image: string;
  imageRounded?: boolean;
  title: string;
  description: React.ReactNode;
  linkHref?: string;
  linkText?: string;
  onLearnMore?: () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-b border-gray-200">
      <div className="flex justify-center items-center">
        <img
          src={image}
          alt={title}
          className={`w-full max-w-md object-contain${imageRounded ? " rounded-full" : ""}`}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4 pt-4">
        <h2 className="text-3xl font-light text-gray-800 text-center">{title}</h2>
        <p className="text-gray-500 text-center">{description}</p>
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="border border-primary text-primary hover:bg-primary hover:text-white transition-colors px-6 py-2 rounded-full text-sm"
          >
            Learn More
          </button>
        )}
        {linkHref && !onLearnMore && (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-primary text-primary hover:bg-primary hover:text-white transition-colors px-6 py-2 rounded-full text-sm"
          >
            {linkText ?? "View Project"}
          </a>
        )}
      </div>
    </div>
  );
}

function ExperienceItem({
  icon,
  title,
  subtitle,
  description,
  onLearnMore,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  description: string;
  onLearnMore?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-6">
      <i className={`${icon} text-primary`} style={{ fontSize: "4rem" }} />
      <h5 className="text-center text-primary font-semibold mt-3">{title}</h5>
      {subtitle && <h6 className="text-center text-gray-500 text-sm mt-1">{subtitle}</h6>}
      <p className="text-center text-gray-500 mt-3 text-sm">{description}</p>
      {onLearnMore && (
        <button
          onClick={onLearnMore}
          className="mt-4 border border-primary text-primary hover:bg-primary hover:text-white transition-colors px-5 py-1.5 rounded-full text-sm"
        >
          Learn More
        </button>
      )}
    </div>
  );
}

// ─── Modal content data ──────────────────────────────────────────────────────

const modalData: Record<string, { title: string; items: string[] }> = {
  google: {
    title: "Google – Software Engineering Intern",
    items: [
      "Wrote Python code for C++ frontend of the Google XLS toolchain.",
      "Worked on the higher-level language synthesis toolchain that allows flexible high-level descriptions of functionality to be changed into synthesizable hardware designs.",
      "Implemented added functionality for translating C++ classes, structs and other operations and language features.",
      "Presented results of work to Google XLS team.",
    ],
  },
  qstodian: {
    title: "Qstodian – Technology and Strategy Consultant",
    items: [
      "Designed and developed the company website using WordPress with assistance from the head graphic designer.",
      "Planned and executed the launch of the company and its flagship product, QTotal.",
      "Researched prospective customers and designed the customer development plan.",
      "Programmed key features of the company's tablet software using C++.",
      "Tested the company's externally created management software and provided recommendations to fix bugs and improve performance.",
      "Installed Qstodian's pilot system for various clients and evaluated initial responses and impressions.",
      "Coordinated with the team to contact new customers and set up the company's first three pilots.",
    ],
  },
  aiEnergy: {
    title: "AI Energy – Information Technology Intern",
    items: [
      "Updated company website including integration of social network feeds and improved user interface.",
      "Managed AI Energy Group's LAN including access control and integration with multiple service providers.",
      "Monitored overall security of AI's systems including physical & logical setups, reviewing change management processes, etc.",
      "Provided technical support to staff to facilitate the day-to-day running of the company.",
      "Maintained operating systems and virtualization platforms, anti-virus programs, emails and cloud storage systems.",
      "Created backup scripts/jobs, reviewed logs, and managed onsite and offsite backups.",
    ],
  },
  research: {
    title: "DePauw University – Research Assistant",
    items: [
      "Researched signals and brainwaves and designed a method to calculate a unique signature using an individual's brain response to set images.",
      "Designed a Java program that elicited brainwaves from a user and recorded the results using an Emotiv EEG headset.",
      "Designed and created a MySQL database that saved brainwave data and a Java program that processed data.",
      "Designed, implemented, and tested a Java program that uses brainwaves as a form of authentication.",
      "Presented results of research to an audience of over 200 people during a poster session for student researchers.",
    ],
  },
  associate: {
    title: "DePauw University – Information Technology Associate",
    items: [
      "Managed school computer inventory including collection, distribution, installation, replacement and repair of computers, peripherals, office phones and A/V equipment.",
      "Troubleshot and resolved software and hardware issues for University staff and students.",
      "Ensured security of campus systems by eliminating malware on computers belonging to staff and students.",
      "Oversaw maintenance of campus printers and resolved all campus printer issues.",
      "Coordinated with the networking department to implement a total restructuring of the campus network.",
      "Created and updated a map of campus buildings and ethernet port locations using Microsoft Visio.",
    ],
  },
  media: {
    title: "Washington University in St. Louis – Media Intern",
    items: [
      "Managed and maintained school media inventory.",
      "Recorded high-quality videos for school events.",
      "Edited school videos for redistribution using Final Cut Pro.",
    ],
  },
  teims: {
    title: "TEIMS – Public Relations",
    items: [
      "Designed and produced newsletters and flyers for the Technology, Engineering, Information Management Society and managed external communications.",
      "Planned seminars and workshops where members could meet and speak with industry professionals.",
      "Managed email communication between members and the governing body, including announcements for events.",
    ],
  },
  asa: {
    title: "African Students Association – President",
    items: [
      "Founded the university's first African Student Association and increased membership from 8 to 50 within a year.",
      "Organized meetings and seminars with guest speakers on issues concerning Africa and its development.",
      "Planned and hosted an African Night complete with fashion show, food sampling, dance performances and addresses by guest speakers with over 180 guests in attendance.",
      "Arranged and conducted an out-of-state trip to an African Student organization conference that allowed 5 members to network with members of African Student Associations from over 50 schools.",
    ],
  },
  cas: {
    title: "CAS Project – Food and Drinks Committee Head",
    items: [
      "Managed the food and drinks committee of my year's CAS (Community, Action, Service) project.",
      "Planned and held raffles to raise money for our charity funfair.",
      "Purchased and resold food and drinks at multiple events over the school year to raise money for the Akropong School for the Blind in Ghana.",
      "Oversaw the marketing of foodstuffs at our charity funfair that resulted in over $12,000 raised for the Akropong School for the Blind.",
    ],
  },
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const close = () => setActiveModal(null);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex justify-center py-2">
        <ul className="flex flex-wrap justify-center gap-1">
          {(["About", "Skills", "Portfolio", "Contact"] as const).map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="block px-5 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-primary hover:text-white transition-colors"
              >
                {id}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Hero ── */}
      <div className="pt-20 min-h-125 flex flex-col items-center bg-white">
        <h1 className="text-5xl font-light text-center text-primary pt-12">
          Kevin Eyram Harlley
        </h1>
        <div className="mt-6 w-full max-w-3xl px-4">
          <img
            src="/images/tech_dev_blue.png"
            alt="Tech development illustration"
            className="w-full object-contain"
          />
        </div>
      </div>

      {/* ── About ── */}
      <section id="About" className="bg-primary px-4 pt-16 pb-36">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8">
            {/* Bio */}
            <div>
              <div className="text-center mb-6">
                <h2 className="text-5xl text-white font-light inline-block">Bio</h2>
                <div className="w-10 h-1 bg-white mx-auto mt-3" />
              </div>
              <p className="text-white font-light mt-8 leading-relaxed text-base">
                Hello there, my name is Kevin Eyram Harlley and this is my website.
                I am currently a Solutions Engineering Analyst at Deloitte Touche Tohmatsu Limited.
              </p>
              <p className="text-white font-light mt-4 leading-relaxed text-base">
                I graduated in 2021 as a dual degree student from Washington University in St. Louis.
                As a dual degree student I received a Bachelor of Arts degree in Computer Science from
                my previous school (DePauw University) in addition to the Bachelor of Science in
                Computer Engineering and Masters in Engineering Management – Data Analytics that I
                received upon completion of my time at Washington University in 2020.
              </p>
              <p className="text-white font-light mt-4 leading-relaxed text-base">
                I am highly interested in Robotics, Software Development, System implementation,
                Machine Learning and Data Science and would love to learn as much as I can about these
                topics as I continue to move forward in life. I have experience with Software
                development both on the functional and technical side with some of my most recent
                experience being with Oracle CPQ.
              </p>
              <p className="text-white font-light mt-4 leading-relaxed text-base">
                Thank you for taking the time to visit my website and I hope you have a great day
                wherever you are.
              </p>
            </div>

            {/* Headshot */}
            <div className="flex justify-center items-start pt-4">
              <img
                src="/images/headshot.png"
                alt="Kevin Harlley"
                className="rounded-full object-cover"
                style={{ width: "340px", height: "340px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="Skills" className="bg-white pb-16">
        <div className="max-w-5xl mx-auto px-4 -mt-28 relative z-10">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-4xl font-light text-center text-primary pb-8">
              Skills and Technologies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 pb-8">
              {/* Column 1 */}
              <div>
                <SkillItem icon="fab fa-css3" name="CSS" level="Expert" />
                <SkillItem icon="fab fa-java" name="Java" level="Expert" />
                <SkillItem icon="fab fa-windows" name="Microsoft Office" level="Expert" />
              </div>
              {/* Column 2 */}
              <div>
                <SkillItem
                  icon="fas fa-video"
                  name="Adobe Photoshop, Fireworks, Edge‑Animate, After‑Effects"
                  level="Expert"
                />
                <SkillItem icon="fab fa-python" name="Python" level="Expert" />
                <SkillItem icon="fas fa-code" name="Ajax" level="Proficient" />
              </div>
              {/* Column 3 */}
              <div>
                <SkillItem icon="fas fa-database" name="MySQL" level="Proficient" />
                <SkillItem icon="fab fa-php" name="PHP" level="Proficient" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section id="Portfolio" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-center text-primary text-5xl font-light mb-4">My Portfolio</h2>

        <PortfolioItem
          image="/images/google_macbook.png"
          title="Google XLS"
          description={
            <>
              During the summer of 2020, I assisted in the coding of Google&apos;s XLS toolchain. A
              link to the project can be found{" "}
              <a
                href="https://github.com/google/xls"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light"
              >
                here
              </a>
              .
            </>
          }
          onLearnMore={() => setActiveModal("google")}
        />

        <PortfolioItem
          image="/images/miihor_macbook.png"
          imageRounded
          title="DePauw Senior Project"
          description="You can find the link to the vendor project I worked on for my Computer Science major at DePauw University below."
          linkHref="https://github.com/kevineharlley/Vendor-Tracking"
          linkText="Link to Files"
        />

        <PortfolioItem
          image="/images/qstodian_macbook.png"
          imageRounded
          title="Qstodian Website"
          description={
            <>
              During the summer of 2019, I assisted in the development of the website before the
              company&apos;s launch. A link to the website can be found{" "}
              <a
                href="https://www.qstodian.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light"
              >
                here
              </a>
              .
            </>
          }
          onLearnMore={() => setActiveModal("qstodian")}
        />

        <PortfolioItem
          image="/images/ai_macbook.png"
          title="AI Energy Website"
          description={
            <>
              A link to the AI Energy website I worked on. Over the course of one year I made
              improvements to the layout of the{" "}
              <a
                href="http://www.aienergygroup.com.gh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light"
              >
                website
              </a>
              .
            </>
          }
          onLearnMore={() => setActiveModal("aiEnergy")}
        />
      </section>

      {/* ── Other Relevant Experience ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-center text-primary text-5xl font-light mb-8">
          Other Relevant Experience
        </h2>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 pb-8">
          <ExperienceItem
            icon="bi bi-laptop"
            title="DePauw University – Research Assistant"
            subtitle="May 2016 – August 2016"
            description="Researched signals and brainwaves and designed a method to calculate a unique signature using an individual's brain response to set images."
            onLearnMore={() => setActiveModal("research")}
          />
          <ExperienceItem
            icon="bi bi-bug"
            title="DePauw University – Information Technology Associate"
            subtitle="August 2014 – August 2017"
            description="Managed school computer inventory including collection, distribution, installation, replacement and repair of computers, peripherals, office phones and A/V equipment."
            onLearnMore={() => setActiveModal("associate")}
          />
          <ExperienceItem
            icon="bi bi-camera-reels"
            title="Washington University in St. Louis – Media Intern"
            subtitle="August 2018 – March 2019"
            description="Managed and maintained school media inventory."
            onLearnMore={() => setActiveModal("media")}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 py-8">
          <ExperienceItem
            icon="bi bi-megaphone"
            title="TEIMS: Public Relations"
            description="Designed and produced newsletters and flyers for the Technology, Engineering, Information Management Society and managed external communications."
            onLearnMore={() => setActiveModal("teims")}
          />
          <ExperienceItem
            icon="bi bi-person-badge"
            title="African Students Association: President"
            description="Founded the university's first African Student Association and increased membership from 8 to 50 within a year."
            onLearnMore={() => setActiveModal("asa")}
          />
          <ExperienceItem
            icon="bi bi-clipboard"
            title="CAS Project: Food and Drinks Committee Head"
            description="Managed the food and drinks committee of my year's CAS (Community, Action, Service) project."
            onLearnMore={() => setActiveModal("cas")}
          />
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="Contact" className="border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl text-primary font-light">Contact</h2>
            <div className="flex items-center gap-2">
              <a
                href="mailto:kharlley24@gmail.com"
                className="p-3 text-gray-700 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <i className="far fa-envelope-open fa-2x" />
              </a>
              <a
                href="tel:812-223-1220"
                className="p-3 text-gray-700 hover:text-primary transition-colors"
                aria-label="Phone"
              >
                <i className="fas fa-mobile-alt fa-2x" />
              </a>
              <a
                href="https://www.linkedin.com/in/kevin-harlley-07400a10a/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-gray-700 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in fa-2x" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modals ── */}
      {Object.entries(modalData).map(([key, { title, items }]) => (
        <Modal key={key} isOpen={activeModal === key} onClose={close} title={title}>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Modal>
      ))}
    </>
  );
}
