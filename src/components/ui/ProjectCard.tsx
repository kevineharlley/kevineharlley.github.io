import { ACCENT_BG, ACCENT_BORDER, ACCENT_CHIP_BORDER, ACCENT_GLOW, ACCENT_HOVER_BG, ACCENT_TEXT, type Accent } from "@/lib/accent";

export function ProjectCard({
  image, title, description, linkHref, linkText, onLearnMore, accent = "emerald",
}: {
  image: string; title: string; description: React.ReactNode;
  linkHref?: string; linkText?: string; onLearnMore?: () => void; accent?: Accent;
}) {
  return (
    <div
      className={`chip-card ${ACCENT_CHIP_BORDER[accent]} ${ACCENT_GLOW[accent]} rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 transition-all duration-300`}
    >
      <div className="flex items-center justify-center p-6 bg-black/20">
        <img src={image} alt={title} className="max-w-full max-h-52 object-contain" />
      </div>
      <div className="flex flex-col justify-center gap-4 p-8">
        <div className={`w-8 h-px ${ACCENT_BG[accent]}`} />
        <h3 className={`text-2xl font-light ${ACCENT_TEXT[accent]}`}>{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className={`self-start px-6 py-2 rounded-full text-xs font-semibold border ${ACCENT_TEXT[accent]} ${ACCENT_BORDER[accent]} ${ACCENT_HOVER_BG[accent]} transition-colors duration-200 hover:text-black`}
          >
            Learn More
          </button>
        )}
        {linkHref && !onLearnMore && (
          <a
            href={linkHref} target="_blank" rel="noopener noreferrer"
            className={`self-start px-6 py-2 rounded-full text-xs font-semibold border ${ACCENT_TEXT[accent]} ${ACCENT_BORDER[accent]} transition-colors duration-200`}
          >
            {linkText ?? "View Project"}
          </a>
        )}
      </div>
    </div>
  );
}
