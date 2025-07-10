// Main theme exports
export * from "./colors";
export * from "./types";
export * from "./theme";

// Import specific items for use in this file
import { colors, lightTheme, darkTheme } from "./colors";

// Re-export the design system for convenience
export { designSystem } from "./theme";

// Theme utilities
export const createThemeStyles = (mode: "light" | "dark") => {
  const currentTheme = mode === "dark" ? darkTheme : lightTheme;

  return {
    backgroundColor: currentTheme.background.primary,
    color: currentTheme.text.primary,
    borderColor: currentTheme.border.primary,
  };
};

// Common style presets
export const stylePresets = {
  button: {
    primary: (mode: "light" | "dark") => ({
      backgroundColor:
        mode === "dark" ? colors.primary[400] : colors.primary[600],
      color: colors.neutral[50],
      border: "none",
      borderRadius: "0.375rem",
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor:
          mode === "dark" ? colors.primary[500] : colors.primary[700],
      },
    }),
    secondary: (mode: "light" | "dark") => ({
      backgroundColor: "transparent",
      color: mode === "dark" ? colors.neutral[300] : colors.neutral[700],
      border: `1px solid ${
        mode === "dark" ? colors.neutral[600] : colors.neutral[300]
      }`,
      borderRadius: "0.375rem",
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor:
          mode === "dark" ? colors.neutral[700] : colors.neutral[100],
      },
    }),
  },
  card: {
    default: (mode: "light" | "dark") => ({
      backgroundColor:
        mode === "dark" ? colors.neutral[800] : colors.neutral[50],
      border: `1px solid ${
        mode === "dark" ? colors.neutral[700] : colors.neutral[200]
      }`,
      borderRadius: "0.5rem",
      padding: "1rem",
      boxShadow:
        mode === "dark"
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }),
  },
  input: {
    default: (mode: "light" | "dark") => ({
      backgroundColor:
        mode === "dark" ? colors.neutral[800] : colors.neutral[50],
      border: `1px solid ${
        mode === "dark" ? colors.neutral[600] : colors.neutral[300]
      }`,
      borderRadius: "0.375rem",
      padding: "0.5rem 0.75rem",
      fontSize: "0.875rem",
      color: mode === "dark" ? colors.neutral[100] : colors.neutral[900],
      "&:focus": {
        outline: "none",
        borderColor: colors.primary[500],
        boxShadow: `0 0 0 3px ${colors.primary[500]}20`,
      },
    }),
  },
} as const;
