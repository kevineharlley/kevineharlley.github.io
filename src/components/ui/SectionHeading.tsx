import type { Accent } from "@/lib/accent";

export function SectionHeading({ label, title, labelColor }: { label: string; title: string; labelColor?: Accent }) {
  void label;
  void labelColor;
  return (
    <div className="text-center mb-12">
      
      <h2 className="text-4xl md:text-5xl font-light mt-3 glow-em text-gold">
        {title}
      </h2>
    </div>
  );
}
