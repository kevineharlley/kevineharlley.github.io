import { ChipLabel } from "@/components/ui/ChipLabel";

const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";
const AM = "var(--color-amethyst)";

export function Contact() {
  return (
    <section id="Contact" className="py-16 px-4" style={{ background: "#06060f" }}>
      <div className="max-w-5xl mx-auto">
        <div className="chip-card rounded-lg px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <ChipLabel color={EM}>// CONTACT</ChipLabel>
            <h2 className="text-3xl font-light mt-2 glow-em" style={{ color: EM }}>Get In Touch</h2>
            <p className="text-slate-500 text-sm mt-1">Always open to new opportunities and conversations.</p>
          </div>
          <div className="flex gap-5">
            <a href="mailto:kharlley24@gmail.com" aria-label="Email"
              className="w-12 h-12 rounded-full flex items-center justify-center border transition-colors duration-200"
              style={{ borderColor: `rgb(from ${EM} r g b / 0.3)`, color: EM }}>
              <i className="far fa-envelope-open text-lg" />
            </a>
            <a href="tel:812-223-1220" aria-label="Phone"
              className="w-12 h-12 rounded-full flex items-center justify-center border transition-colors duration-200"
              style={{ borderColor: `rgb(from ${GO} r g b / 0.3)`, color: GO }}>
              <i className="fas fa-mobile-alt text-lg" />
            </a>
            <a href="https://www.linkedin.com/in/kevin-harlley-07400a10a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="w-12 h-12 rounded-full flex items-center justify-center border transition-colors duration-200"
              style={{ borderColor: `rgb(from ${AM} r g b / 0.3)`, color: AM }}>
              <i className="fab fa-linkedin-in text-lg" />
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span style={{ fontFamily: "var(--font-mono, monospace)" }}>&copy; {new Date().getFullYear()} Kevin Eyram Harlley</span>
          <span className="flex gap-1.5 items-center">
            {[EM, GO, AM].map((c) => <span key={c} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />)}
          </span>
          <span style={{ fontFamily: "var(--font-mono, monospace)" }}>Built with Next.js &middot; React Three Fiber</span>
        </div>
      </div>
    </section>
  );
}
