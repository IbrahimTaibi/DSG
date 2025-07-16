import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export function useRoleRedirect() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role === "delivery" &&
      !router.pathname.startsWith("/delivery") &&
      !router.pathname.startsWith("/auth") &&
      router.pathname !== "/profile"
    ) {
      router.replace("/delivery/dashboard");
    }
    if (
      isAuthenticated &&
      user?.role === "delivery" &&
      router.pathname === "/profile"
    ) {
      router.replace("/delivery/profile");
    }
  }, [isAuthenticated, user, router]);
} 