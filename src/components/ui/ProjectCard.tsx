const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";
const AM = "var(--color-amethyst)";

export function ProjectCard({
  image, title, description, linkHref, linkText, onLearnMore, accent = EM,
}: {
  image: string; title: string; description: React.ReactNode;
  linkHref?: string; linkText?: string; onLearnMore?: () => void; accent?: string;
}) {
  const border = accent === GO ? "chip-card-gold" : accent === AM ? "chip-card-am" : "";
  return (
    <div
      className={`chip-card ${border} rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 transition-all duration-300`}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px rgb(from ${accent} r g b / 0.25)`)
      }
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
    >
      <div className="flex items-center justify-center p-6 bg-black/20">
        <img src={image} alt={title} className="max-w-full max-h-52 object-contain" />
      </div>
      <div className="flex flex-col justify-center gap-4 p-8">
        <div className="w-8 h-px" style={{ background: accent }} />
        <h3 className="text-2xl font-light" style={{ color: accent }}>{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="self-start px-6 py-2 rounded-full text-xs font-semibold border transition-colors duration-200"
            style={{ color: accent, borderColor: `rgb(from ${accent} r g b / 0.4)` }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = accent;
              (e.currentTarget as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = accent;
            }}
          >
            Learn More
          </button>
        )}
        {linkHref && !onLearnMore && (
          <a
            href={linkHref} target="_blank" rel="noopener noreferrer"
            className="self-start px-6 py-2 rounded-full text-xs font-semibold border transition-colors duration-200"
            style={{ color: accent, borderColor: `rgb(from ${accent} r g b / 0.4)` }}
          >
            {linkText ?? "View Project"}
          </a>
        )}
      </div>
    </div>
  );
}
