import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactInfo, narrative } from "@/data";

export function About() {
  return (
    <section id="About" className="circuit-bg py-24 px-4 bg-linear-to-b from-surface to-bg">
      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeading title="About Me"/>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-3 chip-card rounded-lg p-8 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              Hello there, my name is <span className="text-secondary">Kevin Eyram Harlley</span> and this is my website.
              I am a <span className="text-primary">Creative Technologist</span> with an Entrepreneural mindset.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              I graduated in 2021 as a dual degree student from Washington University in St. Louis. I received a
              Bachelor of Arts in Computer Science from DePauw University, a Bachelor of Science in Computer
              Engineering, and a Masters in Engineering Management — Data Analytics from WashU.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">{narrative}</p>
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
              <a href={contactInfo.phoneHref} aria-label="Phone">
                <i className="fas fa-mobile-alt text-lg text-secondary" />
              </a>
              <a href={`mailto:${contactInfo.email}`}>
                <i className="far fa-envelope-open text-lg text-primary" />
              </a>              
              <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in text-lg text-tertiary" />
              </a>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col items-center gap-4">
            <div className="relative w-84 h-84 rounded-full overflow-hidden shadow-lg shadow-secondary/25">
              <div className="absolute inset-0 opacity-30"/>
              <img
                src="/images/headshot.png"
                alt="Kevin Harlley"
                className="clip-chip w-full h-full object-cover border-6 border-secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

