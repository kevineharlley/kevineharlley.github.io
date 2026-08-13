import dynamic from "next/dynamic";

const EM = "var(--color-emerald)";
const GO = "var(--color-gold)";
const AM = "var(--color-amethyst)";

const ChipScene = dynamic(
  () => import("@/components/ChipScene").then((m) => m.ChipScene),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative w-full" style={{ height: "100dvh", minHeight: "600px" }}>
      <div className="absolute inset-0">
        <ChipScene />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pointer-events-none">
        <div
          className="mb-4 px-4 py-1.5 border text-xs tracking-[0.22em] opacity-70"
          style={{ fontFamily: "var(--font-mono, monospace)", borderColor: `rgb(from ${GO} r g b / 0.35)`, color: GO }}
        >
          PORTFOLIO / SOLUTIONS ENGINEER
        </div>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight glow-em" style={{ color: EM }}>
          Kevin Eyram
        </h1>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mt-1">Harlley</h1>
        <p className="mt-5 text-slate-400 text-sm md:text-base max-w-md leading-relaxed">
          Solutions Engineering Analyst — Deloitte — Computer Engineering &amp; Data Analytics
        </p>
        <div className="mt-8 flex gap-6 text-xs" style={{ fontFamily: "var(--font-mono, monospace)" }}>
          {[{ c: EM, label: "emerald" }, { c: GO, label: "gold" }, { c: AM, label: "amethyst" }].map(({ c, label }) => (
            <span key={label} className="flex items-center gap-1.5 opacity-60">
              <span className="w-2 h-2 rounded-sm" style={{ background: c }} />
              {label}
            </span>
          ))}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
          <span className="text-xs tracking-widest" style={{ fontFamily: "var(--font-mono, monospace)", color: EM }}>SCROLL</span>
          <span className="text-lg" style={{ color: EM }}>↓</span>
        </div>
      </div>
    </section>
  );
}
