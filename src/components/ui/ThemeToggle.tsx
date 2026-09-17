"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";
type ThemeMode = "dark" | "light";

// Binary "bit" toggle for accent intensity — 0 = dark mode, 1 = light mode (surfaces stay dark either way).
export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
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
