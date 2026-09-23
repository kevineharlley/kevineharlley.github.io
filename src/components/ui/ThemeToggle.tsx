"use client";

import { useTheme } from "@/context/ThemeContext";

// Binary "bit" toggle for accent intensity — 0 = dark mode, 1 = light mode (surfaces stay dark either way).
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Prevent rendering on the server to avoid hydration mismatch
  if (!theme) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={theme === "light"}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} accent mode`}
      className="relative w-16 h-6 rounded-full border border-quaternary/40 bg-quaternary/10 font-mono text-[0.65rem] text-quaternary transition-colors duration-200"
    >
      <span aria-hidden className={`absolute left-1.5 top-1/2 -translate-y-1/2 ${theme === "dark" ? "opacity-100" : "opacity-40"}`}>
        0
      </span>
      <span aria-hidden className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${theme === "light" ? "opacity-100" : "opacity-40"}`}>
        1
      </span>
      <span
        aria-hidden
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-quaternary transition-transform duration-200 ${
          theme === "light" ? "translate-x-10" : "translate-x-0"
        }`}
      />
    </button>
  );
}
