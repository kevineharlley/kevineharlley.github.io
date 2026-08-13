import { ChipLabel } from "@/components/ui/ChipLabel";

export function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center mb-12">
      <ChipLabel>{label}</ChipLabel>
      <h2 className="text-4xl md:text-5xl font-light mt-3 glow-em text-gold">
        {title}
      </h2>
    </div>
  );
}
