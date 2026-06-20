import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { AppTheme, ThemeName, THEMES } from "../constants/themes";

type ThemeContextValue = {
  themeName: ThemeName;
  theme: AppTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const THEME_KEY = "visual-habit-lab:theme";

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [themeName, setThemeName] = useState<ThemeName>(systemScheme === "dark" ? "dark" : "light");

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(THEME_KEY)
      .then((storedTheme) => {
        if (!mounted) return;
        if (storedTheme === "light" || storedTheme === "dark") {
          setThemeName(storedTheme);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  function setAndPersistTheme(nextTheme: ThemeName) {
    setThemeName(nextTheme);
    AsyncStorage.setItem(THEME_KEY, nextTheme).catch(() => undefined);
  }

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeName,
      theme: THEMES[themeName],
      toggleTheme: () => setAndPersistTheme(themeName === "light" ? "dark" : "light")
    }),
    [themeName]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return value;
}
