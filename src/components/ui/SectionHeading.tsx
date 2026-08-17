import type { Accent } from "@/lib/accent";

export function SectionHeading({ title, labelColor }: { title: string; labelColor?: Accent }) {
  void labelColor;
  return (
    <div className="text-center mb-12">      
      <h2 className="text-4xl md:text-5xl font-light mt-3 glow-em text-gold">
        {title}
      </h2>
    </div>
  );
}
