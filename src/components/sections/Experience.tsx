import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceNode } from "@/components/ui/ExperienceNode";

const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";
const AM = "var(--color-amethyst)";

export function Experience({ onSelectModal }: { onSelectModal: (key: string) => void }) {
  return (
    <section id="Experience" className="py-24 px-4" style={{ background: "linear-gradient(180deg,#0d0d1e 0%,#06060f 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_04" title="Other Experience" labelColor={GO} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-2 text-xs tracking-widest opacity-50" style={{ color: EM, fontFamily: "var(--font-mono, monospace)" }}>RESEARCH</div>
            <ExperienceNode icon="bi bi-laptop" title="DePauw University — Research Assistant" subtitle="May 2016 — August 2016"
              description="Researched brainwave signals and designed a brainwave-based authentication system."
              onLearnMore={() => onSelectModal("research")} accent={EM} />
            <ExperienceNode icon="bi bi-bug" title="DePauw University — IT Associate" subtitle="August 2014 — August 2017"
              description="Managed campus computer inventory, troubleshot hardware/software, and coordinated network restructuring."
              onLearnMore={() => onSelectModal("associate")} accent={EM} />
          </div>
          <div>
            <div className="mb-2 text-xs tracking-widest opacity-50" style={{ color: GO, fontFamily: "var(--font-mono, monospace)" }}>MEDIA &amp; COMMS</div>
            <ExperienceNode icon="bi bi-camera-reels" title="WashU — Media Intern" subtitle="August 2018 — March 2019"
              description="Recorded and edited high-quality videos for university events using Final Cut Pro."
              onLearnMore={() => onSelectModal("media")} accent={GO} />
            <ExperienceNode icon="bi bi-megaphone" title="TEIMS — Public Relations"
              description="Produced newsletters and planned industry seminars for TEIMS society members."
              onLearnMore={() => onSelectModal("teims")} accent={GO} />
          </div>
          <div>
            <div className="mb-2 text-xs tracking-widest opacity-50" style={{ color: AM, fontFamily: "var(--font-mono, monospace)" }}>LEADERSHIP</div>
            <ExperienceNode icon="bi bi-person-badge" title="African Students Association — President"
              description="Founded DePauw's first ASA; grew membership from 8 to 50 and hosted events for 180+ attendees."
              onLearnMore={() => onSelectModal("asa")} accent={AM} />
            <ExperienceNode icon="bi bi-clipboard" title="CAS Project — Committee Head"
              description="Led food & drinks committee, raising $12,000+ for the Akropong School for the Blind."
              onLearnMore={() => onSelectModal("cas")} accent={AM} />
          </div>
        </div>
      </div>
    </section>
  );
}
