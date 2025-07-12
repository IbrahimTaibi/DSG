import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DarkModeProvider, useDarkMode } from "../contexts/DarkModeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { SocketProvider } from "../contexts/SocketContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import BottomNavBar from "../components/layout/nav/BottomNavBar";
import MainNavBar from "../components/layout/nav/MainNavBar";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/Footer";
import CategoryNavBar from "../components/category/CategoryNavBar";
import SidebarLayout from "../components/layout/SidebarLayout";
import PageTransition from "../components/ui/PageTransition";
import CartDrawer from "../components/ui/CartDrawer";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import TopProgressBar from "../components/ui/TopProgressBar";
import { usePageTransition } from "../hooks/usePageTransition";


const AppLayout = React.memo(function AppLayout({ Component, pageProps }: AppProps) {
  const router = useRouter();
  console.log("AppLayout rendered, route:", router.pathname);
  const { darkMode, currentTheme, isInitialized } = useDarkMode();
  const [isLight, setIsLight] = useState(false);
  const { isLoading } = useAuth();
  const { isTransitioning } = usePageTransition();
  // Memoize styles to prevent recreation on every render
  const mainContainerStyles = useMemo(() => ({
    display: "flex" as const,
    flexDirection: "column" as const,
    backgroundColor: currentTheme.background.primary,
    minHeight: "100vh",
  }), [currentTheme.background.primary]);

  const mainStyles = useMemo(() => ({
    flex: 1,
    display: "flex" as const,
    flexDirection: "column" as const,
  }), []);

  const lightOverlayStyles = useMemo(() => ({
    width: "100%",
    height: 64, // header height in px
    background: "#fff",
    position: "fixed" as const,
    top: 0,
    left: 0,
    zIndex: 49,
  }), []);

  useEffect(() => {
    setIsLight(!darkMode);
  }, [darkMode]);

  const isAdminPage = router.pathname.startsWith("/admin");
  const isAuthPage = router.pathname.startsWith("/auth");
  const isCategoryPage = router.pathname.startsWith("/category");

  // Show loading state while theme is not initialized
  if (!isInitialized) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f8fafc' }} // Light fallback
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAdminPage) {
    return (
      <>
        <TopProgressBar loading={isTransitioning} />
        <PageTransition adminMode>
          <Component {...pageProps} />
        </PageTransition>
      </>
    );
  }

  // Don't show loading state for auth pages to prevent flash
  if (isLoading && !isAuthPage) {
    return null; // or a loading spinner
  }

  return (
    <>
      <TopProgressBar loading={isTransitioning} />
      <div style={mainContainerStyles}>
        {isLight && (
          <div style={lightOverlayStyles} />
        )}
        <Header />
        <MainNavBar />
        <CategoryNavBar />
       
        <main style={mainStyles}>
          {isCategoryPage ? (
            <SidebarLayout>
              <Component {...pageProps} />
            </SidebarLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </main>
        <Footer />
        <BottomNavBar />
        <CartDrawer />
      </div>
    </>
  );
});

export default function App(props: AppProps) {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <CartProvider>
              <AppLayout {...props} />
            </CartProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}
