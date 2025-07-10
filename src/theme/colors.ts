// Modern, minimalistic color palette based on provided colors
export const colors = {
  // Primary colors - Based on #27445D (dark blue)
  primary: {
    50: "#f4f6f8",
    100: "#e8ecf1",
    200: "#d1d9e3",
    300: "#a3b3c7",
    400: "#6b8aa3",
    500: "#27445d",
    600: "#1f3649",
    700: "#1a2b3a",
    800: "#15222e",
    900: "#111c25",
  },

  // Secondary colors - Based on #497D74 (teal green)
  secondary: {
    50: "#f2f7f6",
    100: "#e6efed",
    200: "#cce0db",
    300: "#99c1b7",
    400: "#66a293",
    500: "#497d74",
    600: "#3a645d",
    700: "#2e504a",
    800: "#25403c",
    900: "#1e3431",
  },

  // Accent colors - Based on #71BBB2 (light teal)
  accent: {
    50: "#f0f9f8",
    100: "#e1f3f1",
    200: "#c3e7e3",
    300: "#a5dbd5",
    400: "#87cfc7",
    500: "#71bbb2",
    600: "#5a958e",
    700: "#487572",
    800: "#365d5a",
    900: "#2b4a48",
  },

  // Neutral colors - Based on #EFE9D5 (cream)
  neutral: {
    50: "#fefefd",
    100: "#fdfcf9",
    200: "#fbf9f3",
    300: "#f9f6ed",
    400: "#f7f3e7",
    500: "#efe9d5",
    600: "#d7d1bd",
    700: "#b8b29e",
    800: "#99937f",
    900: "#7a7465",
  },

  // Success colors - Emerald green
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  // Warning colors - Amber
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Error colors - Rose
  error: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
  },
} as const;

// Theme-specific color mappings
export const lightTheme = {
  // Background colors - White theme
  background: {
    primary: "#ffffff",
    secondary: "#f8faf8",
    tertiary: "#f1f5f9",
    card: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.4)",
  },

  // Text colors
  text: {
    primary: "#1e293b",
    secondary: "#475569",
    tertiary: "#64748b",
    inverse: "#ffffff",
    muted: "#94a3b8",
  },

  // Border colors
  border: {
    primary: "#e2e8f0",
    secondary: "#cbd5e1",
    accent: "#27445d",
  },

  // Interactive colors - Using provided colors
  interactive: {
    primary: "#27445d",
    primaryHover: "#1f3649",
    secondary: "#497d74",
    secondaryHover: "#3a645d",
    accent: "#71bbb2",
    accentHover: "#5a958e",
  },

  // Status colors
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#f43f5e",
    info: "#27445d",
  },
} as const;

export const darkTheme = {
  // Background colors - Dark theme
  background: {
    primary: "#0f172a",
    secondary: "#1e293b",
    tertiary: "#334155",
    card: "#1e293b",
    overlay: "rgba(0, 0, 0, 0.6)",
  },

  // Text colors
  text: {
    primary: "#f8fafc",
    secondary: "#cbd5e1",
    tertiary: "#94a3b8",
    inverse: "#0f172a",
    muted: "#64748b",
  },

  // Border colors
  border: {
    primary: "#334155",
    secondary: "#475569",
    accent: "#71bbb2",
  },

  // Interactive colors - Using provided colors
  interactive: {
    primary: "#71bbb2",
    primaryHover: "#5a958e",
    secondary: "#87cfc7",
    secondaryHover: "#a5dbd5",
    accent: "#efe9d5",
    accentHover: "#f7f3e7",
  },

  // Status colors
  status: {
    success: "#34d399",
    warning: "#fbbf24",
    error: "#fb7185",
    info: "#71bbb2",
  },
} as const;
