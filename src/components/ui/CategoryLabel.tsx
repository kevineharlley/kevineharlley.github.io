import { ACCENT_TEXT, type Accent } from "@/lib/accent";

// Shared small mono subheading used to label grouped items within a section.
export function CategoryLabel({ children, accent = "primary" }: { children: React.ReactNode; accent?: Accent }) {
  return (
    <div
      className={`mb-2 text-xs tracking-widest opacity-8 font-mono ${ACCENT_TEXT[accent]}`}
    >
      {children}
    </div>
  );
}
