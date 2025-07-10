import React, { useEffect, useState } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { usePageTransition } from "../../hooks/usePageTransition";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  adminMode?: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = "",
  adminMode = false,
}) => {
  const { currentTheme, darkMode } = useDarkMode();
  const { isTransitioning } = usePageTransition();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let spinnerTimeout: NodeJS.Timeout | null = null;
    if (isTransitioning) {
      spinnerTimeout = setTimeout(() => {
        setShowSpinner(true);
      }, 500);
    } else {
      setShowSpinner(false);
    }
    return () => {
      if (spinnerTimeout) clearTimeout(spinnerTimeout);
    };
  }, [isTransitioning]);

  return (
    <div
      className={`page-transition ${className}`}
      style={{
        minHeight: "100vh",
        position: "relative",
        backgroundColor: adminMode
          ? "transparent"
          : currentTheme.background.primary,
      }}>
      {children}
      {showSpinner && (
        <>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center page-transition-overlay"
            style={{
              backgroundColor: darkMode
                ? "rgba(0,0,0,0.32)"
                : "rgba(0,0,0,0.08)",
              backdropFilter: "blur(4px)",
              transition: "background-color 0.3s, opacity 0.3s",
              opacity: 1,
              animation: "fadeInOverlay 0.3s",
            }}>
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: currentTheme.interactive.primary }}
              />
              <div
                className="text-lg font-medium"
                style={{ color: currentTheme.text.primary }}>
                Chargement...
              </div>
            </div>
          </div>
          <style>{`
            @keyframes fadeInOverlay {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default PageTransition;
