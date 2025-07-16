import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDarkMode } from "@/contexts/DarkModeContext";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardLayout({
  children,
  className = "",
}: DashboardLayoutProps) {
  const { currentTheme } = useDarkMode();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [layouts, setLayouts] = useState<Layouts>({
    lg: [
      { i: "user-growth", x: 0, y: 0, w: 6, h: 4 },
      { i: "user-roles", x: 6, y: 0, w: 3, h: 4 },
      { i: "order-stats", x: 9, y: 0, w: 3, h: 4 },
      { i: "revenue-chart", x: 0, y: 4, w: 6, h: 4 },
      { i: "product-performance", x: 6, y: 4, w: 3, h: 4 },
      { i: "recent-activity", x: 9, y: 4, w: 3, h: 4 },
    ],
    md: [
      { i: "user-growth", x: 0, y: 0, w: 6, h: 4 },
      { i: "user-roles", x: 6, y: 0, w: 6, h: 4 },
      { i: "order-stats", x: 0, y: 4, w: 6, h: 4 },
      { i: "revenue-chart", x: 6, y: 4, w: 6, h: 4 },
      { i: "product-performance", x: 0, y: 8, w: 6, h: 4 },
      { i: "recent-activity", x: 6, y: 8, w: 6, h: 4 },
    ],
    sm: [
      { i: "user-growth", x: 0, y: 0, w: 12, h: 3 },
      { i: "user-roles", x: 0, y: 3, w: 12, h: 3 },
      { i: "order-stats", x: 0, y: 6, w: 12, h: 3 },
      { i: "revenue-chart", x: 0, y: 9, w: 12, h: 3 },
      { i: "product-performance", x: 0, y: 12, w: 12, h: 3 },
      { i: "recent-activity", x: 0, y: 15, w: 12, h: 4 },
    ],
    xs: [
      { i: "user-growth", x: 0, y: 0, w: 12, h: 3 },
      { i: "user-roles", x: 0, y: 3, w: 12, h: 3 },
      { i: "order-stats", x: 0, y: 6, w: 12, h: 3 },
      { i: "revenue-chart", x: 0, y: 9, w: 12, h: 3 },
      { i: "product-performance", x: 0, y: 12, w: 12, h: 3 },
      { i: "recent-activity", x: 0, y: 15, w: 12, h: 4 },
    ],
  });

  const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  // Mobile layout using simple flexbox
  if (isMobile) {
    return (
      <div
        className={`dashboard-layout mobile-layout w-full overflow-x-auto ${className}`}
        style={{
          background: currentTheme.background.primary,
          minHeight: "calc(100vh - 120px)",
          padding: 0,
          width: "100%",
          maxWidth: "none",
          minWidth: "100%",
          boxSizing: "border-box",
        }}>
        <div
          className="mobile-grid w-full max-w-none min-w-full"
          style={{ boxSizing: "border-box" }}>
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="mobile-grid-item w-full max-w-none min-w-full p-0 m-0"
              style={{ boxSizing: "border-box", minWidth: "100%" }}>
              <div
                className="w-full max-w-none min-w-full p-0 m-0"
                style={{ boxSizing: "border-box", minWidth: "100%" }}>
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop layout using react-grid-layout
  return (
    <div
      className={`dashboard-layout w-full overflow-x-hidden ${className}`}
      style={{
        background: currentTheme.background.primary,
        minHeight: "calc(100vh - 120px)",
        padding: "20px",
        width: "100%",
        maxWidth: "100vw",
      }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
        isDraggable={false}
        isResizable={false}
        margin={[12, 12]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        preventCollision={false}
        compactType="vertical"
        style={
          {
            "--grid-background": currentTheme.background.primary,
            "--grid-border": currentTheme.border.primary,
          } as React.CSSProperties
        }>
        {children}
      </ResponsiveGridLayout>
    </div>
  );
}
