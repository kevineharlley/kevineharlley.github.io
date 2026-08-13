import { ChipLabel } from "@/components/ui/ChipLabel";

const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";

export function SectionHeading({ label, title, labelColor = EM }: { label: string; title: string; labelColor?: string }) {
  const glowClass = labelColor === GO ? "glow-go" : labelColor === EM ? "glow-em" : "glow-am";
  return (
    <div className="text-center mb-12">
      <ChipLabel color={labelColor}>{label}</ChipLabel>
      <h2 className={`text-4xl md:text-5xl font-light mt-3 ${glowClass}`} style={{ color: labelColor }}>
        {title}
      </h2>
    </div>
  );
}
