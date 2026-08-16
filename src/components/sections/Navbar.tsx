import { ACCENT_BG } from "@/lib/accent";

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-3 px-4"
      style={{ background: "rgba(6,6,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,200,150,0.12)" }}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex gap-1.5">
        {(["emerald", "gold", "amethyst"] as const).map((accent) => (
          <span key={accent} className={`w-1.5 h-1.5 rounded-full opacity-70 ${ACCENT_BG[accent]}`} />
        ))}
      </div>
      <ul className="flex flex-wrap justify-center gap-1">
        {(["About", "Skills", "Portfolio", "Experience", "Contact"] as const).map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="block px-4 py-1.5 rounded text-xs tracking-widest text-slate-400 hover:text-white transition-colors duration-200"
            >
              {id.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
