import { AccentDots } from "@/components/ui/AccentDots";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_LINKS = ["About", "Competencies", "Skills", "Experience", "Portfolio", "Education", "Leadership", "Contact"] as const;

type NavbarProps = {
  activeSection: string | null;
};

export function Navbar({ activeSection }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-3 px-4 bg-surface/85 backdrop-blur-lg border-b border-primary/10"
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex gap-1.5">
        <AccentDots dotClassName="opacity-70" />
      </div>
      <ul className="flex flex-wrap justify-center gap-1">
        {NAV_LINKS.map((id) => {
          const isActive = activeSection === id;
          const activeClass = isActive ? "text-secondary glow-secondary-light" : "text-quarternary";
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block px-4 py-1.5 rounded text-sm tracking-widest  hover:text-quaternary transition-colors duration-200 ${activeClass}`}
              >
                {id.toUpperCase()}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="text-quarternary absolute right-4 top-1/2 -translate-y-1/2">
        <ThemeToggle />
      </div>
    </nav>
  );
}
