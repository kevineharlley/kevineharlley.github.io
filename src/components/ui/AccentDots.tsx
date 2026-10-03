import { ACCENT_BG, type Accent } from "@/lib/accent";

const DOT_ACCENTS: Accent[] = ["primary", "secondary", "tertiary", "quarternary", "quinary"];

// Shared five-dot accent indicator used in the navbar and footer.
export function AccentDots({ dotClassName = "" }: { dotClassName?: string }) {
  return (
    <>
      {DOT_ACCENTS.map((accent) => (
        <span key={accent} className={`w-1.5 h-1.5 rounded-full ${ACCENT_BG[accent]} ${dotClassName}`} />
      ))}
    </>
  );
}
