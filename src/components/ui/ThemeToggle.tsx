"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Binary "bit" toggle for accent intensity — 0 = dark mode, 1 = light mode (surfaces stay dark either way).
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering on the server to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? "dark" : "light"} accent mode`}
      className="relative w-16 h-6 rounded-full border border-quarternary/40 bg-quarternary/10 font-mono text-[0.65rem] text-quarternary transition-colors duration-200"
    >
      <span aria-hidden className={`absolute left-1.5 top-1/2 -translate-y-1/2 ${!isLight ? "opacity-100" : "opacity-40"}`}>
        0
      </span>
      <span aria-hidden className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${isLight ? "opacity-100" : "opacity-40"}`}>
        1
      </span>
      <span
        aria-hidden
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-quarternary transition-transform duration-200 ${
          isLight ? "translate-x-10" : "translate-x-0"
        }`}
      />
    </button>
  );
}
