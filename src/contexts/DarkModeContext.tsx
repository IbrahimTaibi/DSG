import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { theme, type ThemeMode, type Theme } from "@/theme";

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  themeMode: ThemeMode;
  currentTheme: ReturnType<typeof theme.getTheme>;
  getThemeColor: (category: string, property: string) => string;
  isInitialized: boolean;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference or default to system preference
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem("darkMode");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      if (savedDarkMode !== null) {
        setDarkMode(savedDarkMode === "true");
      } else {
        setDarkMode(prefersDark);
      }
      
      // Mark as initialized after setting the initial state
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
      console.log(
        "Dark mode enabled, classes:",
        document.documentElement.classList.toString(),
      );
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
      console.log(
        "Dark mode disabled, classes:",
        document.documentElement.classList.toString(),
      );
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    console.log("Toggle clicked, current darkMode:", darkMode);
    setDarkMode(!darkMode);
  }, [darkMode]);

  const themeMode: ThemeMode = darkMode ? "dark" : "light";
  const currentTheme = useMemo(() => theme.getTheme(themeMode), [themeMode]);

  const getThemeColor = useCallback((category: string, property: string): string => {
    return theme.getThemeColor(themeMode, category as keyof Theme, property);
  }, [themeMode]);

  const contextValue = useMemo(() => ({
    darkMode,
    toggleDarkMode,
    themeMode,
    currentTheme,
    getThemeColor,
    isInitialized,
  }), [darkMode, toggleDarkMode, themeMode, currentTheme, getThemeColor, isInitialized]);

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}
