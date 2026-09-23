import dynamic from "next/dynamic";

const ChipScene = dynamic(
  () => import("@/components/circuit/ChipScene").then((m) => m.ChipScene),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-void">
      <div className="absolute inset-4 md:inset-10 rounded-2xl overflow-hidden">
        <ChipScene />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-start h-full text-center px-6 pt-[12vh] pointer-events-none">
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30">
          <span className="text-md tracking-widest font-mono text-quarternary">SCROLL</span>
          <span className="text-3xl text-quarternary glow-secondary">↓</span>
        </div>
      </div>
    </section>
  );
}
