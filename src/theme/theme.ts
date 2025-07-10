import { colors, lightTheme, darkTheme } from "./colors";
import type { Theme, ThemeMode } from "./types";

// Centralized theme object
export const theme = {
  colors,
  light: lightTheme,
  dark: darkTheme,

  // Utility function to get current theme based on mode
  getTheme: (mode: ThemeMode): Theme => {
    return mode === "dark" ? darkTheme : lightTheme;
  },

  // Utility function to get a specific color from the palette
  getColor: (
    colorName: keyof typeof colors,
    shade: keyof typeof colors.primary,
  ): string => {
    return colors[colorName][shade];
  },

  // Utility function to get theme-aware color
  getThemeColor: (
    mode: ThemeMode,
    category: keyof Theme,
    property: string,
  ): string => {
    const currentTheme = theme.getTheme(mode);
    return currentTheme[category][
      property as keyof (typeof currentTheme)[typeof category]
    ];
  },
} as const;

// Spacing scale
export const spacing = {
  0: "0px",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
} as const;

// Border radius scale
export const borderRadius = {
  none: "0px",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

// Font sizes
export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
} as const;

// Font weights
export const fontWeight = {
  thin: "100",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

// Transitions
export const transitions = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
} as const;

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Export everything as a single theme object
export const designSystem = {
  colors,
  theme,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  transitions,
  shadows,
  zIndex,
  breakpoints,
} as const;
