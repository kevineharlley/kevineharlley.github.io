import dynamic from "next/dynamic";

const ChipScene = dynamic(
  () => import("@/components/ChipScene").then((m) => m.ChipScene),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <ChipScene />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pointer-events-none">
        <div
          className="mb-4 px-4 py-1.5 border text-xs tracking-[0.22em] opacity-70 font-mono border-teal-500 text-teal-500 rounded"
        >
          CREATIVE TECHNOLOGIST
        </div>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-shadow-sm text-shadow-yellow-200 text-gold">
          Kevin Eyram
        </h1>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mt-1 text-shadow-gray-300">Harlley</h1>
        <p className="mt-5 text-emerald text-sm md:text-base max-w-md leading-relaxed">
          Creative Technologist — Computer Engineering & Data Analytics
        </p>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
          <span className="text-xs tracking-widest font-mono text-teal-500">SCROLL</span>
          <span className="text-lg text-teal-500">↓</span>
        </div>
      </div>
    </section>
  );
}
