import React from "react";
import { useAdminProtection } from "../../../hooks/useAdminProtection";
import ErrorPage from "../../ui/ErrorPage";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { Shield, Loader2 } from "lucide-react";

interface AdminProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminProtected({
  children,
  fallback,
}: AdminProtectedProps) {
  const { isAdmin, isLoading, error } = useAdminProtection();
  const { currentTheme } = useDarkMode();

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: currentTheme.background.primary }}>
        <div className="text-center">
          <Loader2
            className="mx-auto w-16 h-16 mb-4 animate-spin"
            style={{ color: currentTheme.interactive.primary }}
          />
          <p
            className="text-lg font-medium"
            style={{ color: currentTheme.text.secondary }}>
            Vérification des permissions...
          </p>
        </div>
      </div>
    );
  }

  // Show error if not admin
  if (error || !isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <ErrorPage
        title="Accès refusé"
        message={
          error ||
          "Vous n'avez pas les permissions nécessaires pour accéder à cette page"
        }
        errorCode="403"
        icon={
          <Shield
            className="w-12 h-12"
            style={{ color: currentTheme.status.error }}
          />
        }
      />
    );
  }

  // User is admin, render children
  return <>{children}</>;
}
