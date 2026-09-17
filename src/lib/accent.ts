export type Accent = "primary" | "secondary" | "tertiary";

export const ACCENT_TEXT: Record<Accent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export const ACCENT_BORDER: Record<Accent, string> = {
  primary: "border-primary",
  secondary: "border-secondary",
  tertiary: "border-tertiary",
};

export const ACCENT_BORDER_SOFT: Record<Accent, string> = {
  primary: "border-primary/25",
  secondary: "border-secondary/25",
  tertiary: "border-tertiary/25",
};

export const ACCENT_BG: Record<Accent, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

export const ACCENT_BG_SOFT: Record<Accent, string> = {
  primary: "bg-primary/10",
  secondary: "bg-secondary/10",
  tertiary: "bg-tertiary/10",
};

// Matches the border-color variants defined in globals.css (.chip-card-secondary / .chip-card-tertiary)
export const ACCENT_CHIP_BORDER: Record<Accent, string> = {
  primary: "",
  secondary: "chip-card-secondary",
  tertiary: "chip-card-tertiary",
};

export const ACCENT_GLOW: Record<Accent, string> = {
  primary: "hover:shadow-lg hover:shadow-primary/25",
  secondary: "hover:shadow-lg hover:shadow-secondary/25",
  tertiary: "hover:shadow-lg hover:shadow-tertiary/25",
};

export const ACCENT_HOVER_BG: Record<Accent, string> = {
  primary: "hover:bg-primary",
  secondary: "hover:bg-secondary",
  tertiary: "hover:bg-tertiary",
};
