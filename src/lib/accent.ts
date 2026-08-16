export type Accent = "emerald" | "gold" | "amethyst";

export const ACCENT_TEXT: Record<Accent, string> = {
  emerald: "text-emerald",
  gold: "text-gold",
  amethyst: "text-amethyst",
};

export const ACCENT_BORDER: Record<Accent, string> = {
  emerald: "border-emerald",
  gold: "border-gold",
  amethyst: "border-amethyst",
};

export const ACCENT_BORDER_SOFT: Record<Accent, string> = {
  emerald: "border-emerald/25",
  gold: "border-gold/25",
  amethyst: "border-amethyst/25",
};

export const ACCENT_BG: Record<Accent, string> = {
  emerald: "bg-emerald",
  gold: "bg-gold",
  amethyst: "bg-amethyst",
};

export const ACCENT_BG_SOFT: Record<Accent, string> = {
  emerald: "bg-emerald/10",
  gold: "bg-gold/10",
  amethyst: "bg-amethyst/10",
};

// Matches the border-color variants defined in globals.css (.chip-card-gold / .chip-card-am)
export const ACCENT_CHIP_BORDER: Record<Accent, string> = {
  emerald: "",
  gold: "chip-card-gold",
  amethyst: "chip-card-am",
};

export const ACCENT_GLOW: Record<Accent, string> = {
  emerald: "hover:shadow-lg hover:shadow-emerald/25",
  gold: "hover:shadow-lg hover:shadow-gold/25",
  amethyst: "hover:shadow-lg hover:shadow-amethyst/25",
};

export const ACCENT_HOVER_BG: Record<Accent, string> = {
  emerald: "hover:bg-emerald",
  gold: "hover:bg-gold",
  amethyst: "hover:bg-amethyst",
};
