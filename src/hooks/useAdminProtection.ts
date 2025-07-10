import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

interface AdminProtectionResult {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdminProtection(): AdminProtectionResult {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour accéder à cette page");
      setIsLoading(false);
      return;
    }

    // Check if user has admin role
    if (user?.role !== "admin") {
      setError(
        "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
      );
      setIsLoading(false);
      return;
    }

    // User is admin, allow access
    setIsLoading(false);
    setError(null);
  }, [isAuthenticated, user, authLoading]);

  return {
    isAdmin: user?.role === "admin" && isAuthenticated,
    isLoading,
    error,
  };
}
