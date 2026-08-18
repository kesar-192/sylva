import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "sylva-theme-prefs";

const defaults = {
  mode: "dark", // dark | amoled | light
  accent: "teal", // teal | purple | rose | amber | blue
  fontSize: "md", // sm | md | lg
  density: "comfortable", // comfortable | compact
};

const loadPrefs = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaults, ...stored };
  } catch {
    return defaults;
  }
};

export const ThemeProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(loadPrefs);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", prefs.mode);
    document.documentElement.setAttribute("data-accent", prefs.accent);
    document.documentElement.setAttribute("data-font-size", prefs.fontSize);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const updatePrefs = (partial) => setPrefs((p) => ({ ...p, ...partial }));

  return (
    <ThemeContext.Provider value={{ ...prefs, updatePrefs }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
