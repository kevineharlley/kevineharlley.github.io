import { PageSection } from "@/components/ui/PageSection";
import { ChipLabel } from "@/components/ui/ChipLabel";
import { AccentDots } from "@/components/ui/AccentDots";
import { ACCENT_TEXT } from "@/lib/accent";
import { contactInfo } from "@/data";

export function Contact() {
  return (
    <PageSection id="Contact" title="Get In Touch" accent="quarternary" className="circuit-bg bg-bg">
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="chip-card chip-card-quarternary rounded-lg px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <ChipLabel accent="quarternary">CONTACT</ChipLabel>
            <h2 className={`text-3xl font-light mt-2 glow-quarternary ${ACCENT_TEXT.quarternary}`}>Get In Touch</h2>
            <p className="text-slate-500 text-sm mt-1">Always open to new opportunities and conversations.</p>
          </div>
          <div className="flex gap-5">
            <a href={contactInfo.phoneHref} aria-label="Phone"
              className="w-12 h-12 rounded-full flex items-center justify-center border border-secondary transition-colors duration-200 text-secondary">
              <i className="fas fa-mobile-alt text-lg" />
            </a>
            <a href={`mailto:${contactInfo.email}`} aria-label="Email"
              className="w-12 h-12 rounded-full flex items-center justify-center border border-primary transition-colors duration-200 text-primary">
              <i className="far fa-envelope-open text-lg" />
            </a>            
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="w-12 h-12 rounded-full flex items-center justify-center border border-tertiary transition-colors duration-200 text-tertiary">
              <i className="fab fa-linkedin-in text-lg" />
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <span className="text-quarternary font-mono">&copy; {new Date().getFullYear()} Kevin Eyram Harlley</span>
          <span className="flex gap-1.5 items-center">
            <AccentDots />
          </span>
          <span className="font-mono">Built with Next.js &middot; React Three Fiber</span>
        </div>
      </div>
    </PageSection>
  );
}

