import React from "react";
import ErrorPage from "../components/ui/ErrorPage";
import { useDarkMode } from "../contexts/DarkModeContext";
import { Settings } from "lucide-react";

export default function Custom500() {
  const { currentTheme } = useDarkMode();

  return (
    <ErrorPage
      title="Erreur serveur"
      message="Une erreur interne s'est produite. Nos équipes ont été notifiées et travaillent à résoudre le problème."
      errorCode="500"
      icon={
        <Settings
          className="w-12 h-12"
          style={{ color: currentTheme.status.error }}
        />
      }
    />
  );
}
