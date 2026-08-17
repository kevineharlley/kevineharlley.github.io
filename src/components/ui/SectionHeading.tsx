import type { Accent } from "@/lib/accent";
import { ACCENT_TEXT } from "@/lib/accent";

export function SectionHeading({
  label,
  title,
  labelColor,
}: {
  label: string;
  title: string;
  labelColor?: Accent;
}) {
  return (
    <div className="text-center mb-12">
      <span className={`text-xs tracking-[0.2em] uppercase font-medium ${ACCENT_TEXT[labelColor ?? "emerald"]}`}>
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl font-light mt-3 glow-em text-gold">
        {title}
      </h2>
    </div>
  );
}
