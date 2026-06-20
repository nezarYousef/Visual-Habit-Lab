import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { AppTheme, ThemeName, THEMES } from "../constants/themes";

type ThemeContextValue = {
  themeName: ThemeName;
  theme: AppTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [themeName, setThemeName] = useState<ThemeName>(systemScheme === "dark" ? "dark" : "light");

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeName,
      theme: THEMES[themeName],
      toggleTheme: () => setThemeName((current) => (current === "light" ? "dark" : "light"))
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
