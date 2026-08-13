const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";
const AM = "var(--color-amethyst)";

export function ChipLabel({ children, color = EM }: { children: React.ReactNode; color?: string }) {
  const border = color === GO ? "chip-card-gold" : color === AM ? "chip-card-am" : "";
  return (
    <div
      className={`chip-card ${border} inline-block px-6 py-2 mb-2`}
      style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", color, letterSpacing: "0.18em" }}
    >
      {children}
    </div>
  );
}
