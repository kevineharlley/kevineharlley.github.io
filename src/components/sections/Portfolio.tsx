import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";

const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";
const AM = "var(--color-amethyst)";

export function Portfolio({ onSelectModal }: { onSelectModal: (key: string) => void }) {
  return (
    <section id="Portfolio" className="py-24 px-4" style={{ background: "linear-gradient(180deg,#131328 0%,#0d0d1e 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_03" title="Portfolio" labelColor={AM} />
        <div className="flex flex-col gap-6">
          <ProjectCard
            image="/images/google_macbook.png"
            title="Google XLS Toolchain"
            description={
              <>
                Assisted in coding Google&apos;s XLS toolchain — a high-level language synthesis toolchain for synthesizable
                hardware design.{" "}
                <a href="https://github.com/google/xls" target="_blank" rel="noopener noreferrer" style={{ color: EM }}>GitHub →</a>
              </>
            }
            onLearnMore={() => onSelectModal("google")}
            accent={EM}
          />
          <ProjectCard
            image="/images/miihor_macbook.png"
            title="DePauw Senior Project"
            description="Vendor-tracking system built for my Computer Science major at DePauw University."
            linkHref="https://github.com/kevineharlley/Vendor-Tracking"
            linkText="View on GitHub"
            accent={GO}
          />
          <ProjectCard
            image="/images/qstodian_macbook.png"
            title="Qstodian Website"
            description={
              <>
                Assisted in developing the Qstodian website for its company launch in 2019.{" "}
                <a href="https://www.qstodian.co/" target="_blank" rel="noopener noreferrer" style={{ color: AM }}>qstodian.co →</a>
              </>
            }
            onLearnMore={() => onSelectModal("qstodian")}
            accent={AM}
          />
          <ProjectCard
            image="/images/ai_macbook.png"
            title="AI Energy Website"
            description={
              <>
                Improved layout and features of the{" "}
                <a href="http://www.aienergygroup.com.gh/" target="_blank" rel="noopener noreferrer" style={{ color: EM }}>
                  AI Energy Group website
                </a>{" "}
                over the course of one year.
              </>
            }
            onLearnMore={() => onSelectModal("aiEnergy")}
            accent={EM}
          />
        </div>
      </div>
    </section>
  );
}
