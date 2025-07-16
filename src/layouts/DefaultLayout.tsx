import Header from "../components/layout/header/Header";
import MainNavBar from "../components/layout/nav/MainNavBar";
import BottomNavBar from "../components/layout/nav/BottomNavBar";
import Footer from "../components/layout/Footer";
import CategoryNavBar from "../components/category/CategoryNavBar";
import SidebarLayout from "../components/layout/SidebarLayout";
import CartDrawer from "../components/ui/CartDrawer";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { CSSProperties } from "react";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { darkMode, currentTheme } = useDarkMode();
  const [isLight, setIsLight] = useState(false);
  const router = useRouter();
  const isCategoryPage = router.pathname.startsWith("/category");
  const isDeliveryPage = router.pathname.startsWith("/delivery");

  useEffect(() => {
    setIsLight(!darkMode);
  }, [darkMode]);

  const mainContainerStyles = useMemo<CSSProperties>(() => ({
    display: "flex",
    flexDirection: "column",
    backgroundColor: currentTheme.background.primary,
    minHeight: "100vh",
  }), [currentTheme.background.primary]);

  const mainStyles = useMemo<CSSProperties>(() => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
  }), []);

  const lightOverlayStyles = useMemo<CSSProperties>(() => ({
    width: "100%",
    height: "64px",
    background: "#fff",
    position: "fixed",
    top: "0px",
    left: "0px",
    zIndex: 49,
  }), []);

  return (
    <div style={mainContainerStyles}>
      {isLight && <div style={lightOverlayStyles} />}
      <Header />
      <MainNavBar />
      {!isDeliveryPage && <CategoryNavBar />}
      <main style={mainStyles}>
        {isCategoryPage ? (
          <SidebarLayout>{children}</SidebarLayout>
        ) : (
          children
        )}
      </main>
      {!isDeliveryPage && <Footer />}
      <BottomNavBar />
      <CartDrawer />
    </div>
  );
} 