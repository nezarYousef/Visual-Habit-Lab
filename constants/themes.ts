import { COLORS } from "./colors";

export const THEMES = {
  light: {
    name: "light",
    background: COLORS.cloud,
    surface: COLORS.paper,
    surfaceMuted: COLORS.mint,
    text: COLORS.ink,
    textMuted: COLORS.slate,
    border: COLORS.border,
    primary: COLORS.pine,
    accent: COLORS.sky,
    warm: COLORS.amber,
    danger: COLORS.danger
  },
  dark: {
    name: "dark",
    background: "#101820",
    surface: "#172330",
    surfaceMuted: "#20352D",
    text: "#F4F7F5",
    textMuted: "#AAB7C4",
    border: "#2D3F4D",
    primary: "#79C99E",
    accent: "#7BC5F7",
    warm: "#F4C95D",
    danger: "#FB7185"
  }
} as const;

export type ThemeName = keyof typeof THEMES;
export type AppTheme = (typeof THEMES)[ThemeName];
