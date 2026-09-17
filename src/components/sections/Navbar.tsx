import { AccentDots } from "@/components/ui/AccentDots";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-3 px-4 bg-surface/85 backdrop-blur-lg border-b border-primary/10"
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex gap-1.5">
        <AccentDots dotClassName="opacity-70" />
      </div>
      <ul className="flex flex-wrap justify-center gap-1">
        {(["About", "Skills", "Portfolio", "Education", "Leadership", "Contact"] as const).map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="block px-4 py-1.5 rounded text-xs tracking-widest text-slate-400 hover:text-quaternary transition-colors duration-200"
            >
              {id.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <ThemeToggle />
      </div>
    </nav>
  );
}
