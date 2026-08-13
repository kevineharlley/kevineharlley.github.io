import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="About" className="py-24 px-4 bg-gradient-to-b from-[#06060f] to-[#0d0d1e]">
      <div className="max-w-5xl mx-auto">
        <SectionHeading label="// MODULE_01" title="About Me"/>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-3 chip-card rounded-lg p-8 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              Hello there, my name is <span className="text-emerald">Kevin Eyram Harlley</span> and this is my website.
              I am a <span className="text-gold">Creative Technologist</span> with an Entrepreneural mindset.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              I graduated in 2021 as a dual degree student from Washington University in St. Louis. I received a
              Bachelor of Arts in Computer Science from DePauw University, a Bachelor of Science in Computer
              Engineering, and a Masters in Engineering Management — Data Analytics from WashU.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              I am highly interested in Robotics, Software Development, System Implementation, Machine Learning,
              Data Science and the intersection of business and technology. I have experience with Software development 
              on both the functional and technical sides, with my most recent experiences centered around the application
              of technology in manufacturing and Enterprise Infrastructure.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Thank you for taking the time to visit my website and I hope you have a great day wherever you are.
            </p>
            <div className="pt-4 flex gap-4">
              <a href="mailto:kharlley24@gmail.com">
                <i className="far fa-envelope-open text-lg text-emerald" />
              </a>
              <a href="https://www.linkedin.com/in/kevin-harlley-07400a10a/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in text-lg text-gold" />
              </a>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col items-center gap-4">
            <div className="relative" style={{ width: "240px", height: "240px" }}>
              <div className="absolute inset-0 rounded-full opacity-30"/>
              <img
                src="/images/headshot.png"
                alt="Kevin Harlley"
                className="clip-chip w-full h-full object-cover border-4 border-gold rounded-full shadow-lg shadow-amethyst/35"
              />
            </div>
            <div className="chip-card px-5 py-2 text-center font-mono">
              <div className="text-sm font-semibold text-slate-200">Kevin Eyram Harlley</div>
              <div className="text-xs text-amethyst">Creative Technologist</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
