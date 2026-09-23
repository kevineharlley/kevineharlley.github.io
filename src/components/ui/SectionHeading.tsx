import { ACCENT_TEXT, type Accent } from "@/lib/accent";

export function SectionHeading({ title, accent }: { title: string; accent: Accent }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-semibold glow-quarternary text-quarternary">
        {title}
      </h2>
    </div>
  );
}
