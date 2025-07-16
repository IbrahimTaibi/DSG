import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { usePageTransition } from "../hooks/usePageTransition";
import AppProviders from "../providers/AppProviders";
import DefaultLayout from "../layouts/DefaultLayout";
import AdminLayout from "../layouts/AdminLayout";
import DeliveryLayoutWrapper from "../layouts/DeliveryLayout";
import { useRoleRedirect } from "../hooks/useRoleRedirect";
import TopProgressBar from "../components/ui/TopProgressBar";

function AppLayout({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { isInitialized } = useDarkMode();
  const { isTransitioning } = usePageTransition();

  useRoleRedirect();

  const isAdminPage = router.pathname.startsWith("/admin");
  const isAuthPage = router.pathname.startsWith("/auth");
  const isDeliveryPage = router.pathname.startsWith("/delivery");

  if (!isInitialized) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f8fafc' }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAdminPage) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  if (isLoading && !isAuthPage) {
    return null;
  }

  // Delivery agent layout
  if (user?.role === "delivery" && (router.pathname === "/profile" || isDeliveryPage)) {
    return (
      <DeliveryLayoutWrapper>
        <Component {...pageProps} />
      </DeliveryLayoutWrapper>
    );
  }

  // Default layout
  return (
    <>
      <TopProgressBar loading={isTransitioning} />
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <AppProviders>
      <AppLayout {...props} />
    </AppProviders>
  );
}
