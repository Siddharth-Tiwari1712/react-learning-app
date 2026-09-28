// STAGE 6: Theme context. A second, separate context on purpose:
// toggling theme should not re-render components that only care about auth.
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // EFFECT = synchronize React state with something OUTSIDE React (DOM + storage).
  useEffect(() => {
    document.documentElement.dataset.theme = theme; // CSS reacts to [data-theme]
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
