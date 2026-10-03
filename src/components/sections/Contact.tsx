import { PageSection } from "@/components/ui/PageSection";
import { AccentDots } from "@/components/ui/AccentDots";
import { contactInfo } from "@/data";
import { FaMobileAlt, FaLinkedinIn } from "react-icons/fa";
import { FaRegEnvelopeOpen } from "react-icons/fa6";

export function Contact() {
  return (
    <PageSection id="Contact" title="Get In Touch" accent="quarternary" className="circuit-bg bg-bg">
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="chip-card chip-card-quarternary rounded-lg px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div><span className="text-xs border-2 border-quarternary p-1 text-quarternary border-l-8">CONTACT</span></div>
            <p className="text-3xl font-light mt-2 glow-quarternary text-quarternary">Get In Touch</p>
            <p className="text-slate-500 text-sm mt-1">Always open to new opportunities and conversations.</p>
          </div>
          <div className="flex gap-5">
            <a href={contactInfo.phoneHref} aria-label="Phone"
              className="w-12 h-12 rounded-full flex items-center justify-center border border-secondary transition-colors duration-200 text-secondary">
              <FaMobileAlt className="text-lg" />
            </a>
            <a href={`mailto:${contactInfo.email}`} aria-label="Email"
              className="w-12 h-12 rounded-full flex items-center justify-center border border-primary transition-colors duration-200 text-primary">
              <FaRegEnvelopeOpen className="text-lg" />
            </a>            
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="w-12 h-12 rounded-full flex items-center justify-center border border-tertiary transition-colors duration-200 text-tertiary">
              <FaLinkedinIn className="text-lg" />
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
