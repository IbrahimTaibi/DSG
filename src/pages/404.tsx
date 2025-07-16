import React from "react";
import ErrorPage from "../components/ui/ErrorPage";
import { useDarkMode } from "../contexts/DarkModeContext";
import { FileQuestion } from "lucide-react";

export default function Custom404() {
  const { currentTheme } = useDarkMode();

  return (
    <ErrorPage
      title="Page introuvable"
      message="La page que vous recherchez n'existe pas ou a été déplacée."
      errorCode="404"
      icon={
        <FileQuestion
          className="w-12 h-12"
          style={{ color: currentTheme.status.warning }}
        />
      }
      backgroundColor={currentTheme.background.primary}
      textColor={currentTheme.text.primary}
    />
  );
}
