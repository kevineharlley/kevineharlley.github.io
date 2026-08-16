# Project Guidelines

Personal portfolio site for Kevin Eyram Harlley, built as a single scrolling page ([src/app/page.tsx](../src/app/page.tsx)) of stacked `<section>` components.

## Tech Stack

- **Framework**: Next.js 16 (App Router, static export via `output: "export"` in [next.config.ts](../next.config.ts)) — no server runtime, everything renders to static HTML/JS in `out/`.

- **UI**: React 19, TypeScript (strict mode), Tailwind CSS v4 (via `@tailwindcss/postcss`, no `tailwind.config.js` — theme is defined in CSS).

- **3D/animation**: `three`, `@react-three/fiber`, `@react-three/drei` for the hero canvas ([src/components/ChipScene.tsx](../src/components/ChipScene.tsx)). Client components using these must be dynamically imported with `ssr: false`.

- **Icons**: Font Awesome 5 and Bootstrap Icons, loaded via CDN `<link>` tags in [src/app/layout.tsx](../src/app/layout.tsx) (use `fab fa-*`/`fas fa-*`/`far fa-*` or `bi bi-*` classes, no npm icon packages).

- **Package manager**: pnpm (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`). Use `pnpm`, not `npm`/`yarn`.

- **Dev/build**: `pnpm dev` (Turbopack), `pnpm build`, `pnpm lint` (ESLint via `next lint`).

## Architecture

- `src/app/` — root layout, global CSS, single page composing sections.
- `src/components/sections/` — one component per page section (`Hero`, `About`, `Skills`, `WorkExperience`, `Portfolio`, `Experience`, `Contact`, `Navbar`, `ProfileModals`), wired together in [src/app/page.tsx](../src/app/page.tsx) and separated by `<TraceRule />` dividers.
- `src/components/ui/` — small reusable presentational pieces used by sections (`SectionHeading`, `ChipLabel`, `ProjectCard`, `SkillChip`, `ExperienceNode`, `ExperienceCard`, `TraceRule`).
- `src/data/` — static content (`modalData.ts` for the "Learn More" modal bullet lists, `experienceData.ts` for the flip-card work experience section). Add new site copy/content here rather than inline in components.
- `src/lib/accent.ts` — shared accent-color type and Tailwind class lookup maps (see Conventions below).

Section headings use a `// MODULE_0X` label convention (see [SectionHeading.tsx](../src/components/ui/SectionHeading.tsx)); keep module numbers sequential when adding/reordering sections.

## Conventions

**Theme colors**: the palette (`emerald`, `gold`, `amethyst`, plus `teal`) is defined once as CSS custom properties in the `@theme` block of [globals.css](../src/app/globals.css) (`--color-emerald`, `--color-gold`, `--color-amethyst`, `--color-teal`). Tailwind v4 auto-generates utility classes from these (`text-emerald`, `bg-gold/10`, `border-amethyst/25`, `shadow-emerald/25`, etc. — opacity modifiers work on any of them).

- Do **not** reintroduce local JS color constants (the old `EM`/`GO`/`AM` pattern). Always reach for the generated Tailwind utility classes, or the shared maps in [src/lib/accent.ts](../src/lib/accent.ts) when a color needs to be selected dynamically from a component prop.
- Components that accept a dynamic accent color should type it as `Accent` (`"emerald" | "gold" | "amethyst"`) from `@/lib/accent`, and look up classes via `ACCENT_TEXT`, `ACCENT_BORDER`, `ACCENT_BORDER_SOFT`, `ACCENT_BG`, `ACCENT_BG_SOFT`, `ACCENT_GLOW`, or `ACCENT_CHIP_BORDER` rather than building `style={{ color: ... }}` objects.
- Raw `rgb(from var(--color-x) r g b / alpha)` syntax is only for CSS files (`globals.css`) where a class-based approach isn't possible (keyframes, pseudo-elements like `::-webkit-scrollbar-thumb`).
- The `chip-card` class (plus `chip-card-gold` / `chip-card-am` variants) is the standard card/border treatment used across sections — reuse it for new cards instead of writing new border/glass styles.
