import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const resolved =
      theme === "system" ? (systemDark ? "dark" : "light") : theme;
    root.dataset.theme = resolved;
  }, [theme]);

  return (
    <div className="flex items-center gap-2 text-sm">
      {(["light", "dark", "system"] as const).map((option) => (
        <button
          key={option}
          className={`rounded-full border px-3 py-1 transition ${
            theme === option
              ? "bg-slate-900 text-white shadow"
              : "bg-white/70 text-slate-900"
          }`}
          onClick={() => setTheme(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
