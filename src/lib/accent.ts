export type Accent = "primary" | "secondary" | "tertiary" | "quarternary";

export const ACCENT_TEXT: Record<Accent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  quarternary: "text-quarternary",
};

export const ACCENT_BORDER: Record<Accent, string> = {
  primary: "border-primary",
  secondary: "border-secondary",
  tertiary: "border-tertiary",
  quarternary: "border-quarternary",
};

export const ACCENT_BORDER_SOFT: Record<Accent, string> = {
  primary: "border-primary/25",
  secondary: "border-secondary/25",
  tertiary: "border-tertiary/25",
  quarternary: "border-quarternary/25",
};

export const ACCENT_BG: Record<Accent, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  quarternary: "bg-quarternary",
};

export const ACCENT_BG_SOFT: Record<Accent, string> = {
  primary: "bg-primary-soft",
  secondary: "bg-secondary-soft",
  tertiary: "bg-tertiary-soft",
  quarternary: "bg-quarternary-soft",
};

// Matches the border-color variants defined in globals.css (.chip-card-secondary / .chip-card-tertiary / .chip-card-quarternary)
export const ACCENT_CHIP_BORDER: Record<Accent, string> = {
  primary: "",
  secondary: "chip-card-secondary",
  tertiary: "chip-card-tertiary",
  quarternary: "chip-card-quarternary",
};

export const ACCENT_GLOW: Record<Accent, string> = {
  primary: "hover:shadow-lg hover:shadow-primary/25",
  secondary: "hover:shadow-lg hover:shadow-secondary/25",
  tertiary: "hover:shadow-lg hover:shadow-tertiary/25",
  quarternary: "hover:shadow-lg hover:shadow-quarternary/25",
};

export const ACCENT_HOVER_BG: Record<Accent, string> = {
  primary: "hover:bg-primary",
  secondary: "hover:bg-secondary",
  tertiary: "hover:bg-tertiary",
  quarternary: "hover:bg-quarternary",
};
