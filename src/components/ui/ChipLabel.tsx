import { ACCENT_CHIP_BORDER, ACCENT_TEXT, type Accent } from "@/lib/accent";

export function ChipLabel({ children, accent = "primary" }: { children: React.ReactNode; accent?: Accent }) {
  return (
    <div
      className={`chip-card ${ACCENT_CHIP_BORDER[accent]} ${ACCENT_TEXT[accent]} inline-block px-6 py-2 mb-2 font-mono`}
    >
      {children}
    </div>
  );
}
