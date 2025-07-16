import React from "react";
import Link from "next/link";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../hooks/useAuth";

interface DashboardButtonProps {
  className?: string;
}

export default function DashboardButton({
  className = "",
}: DashboardButtonProps) {
  const { currentTheme } = useDarkMode();
  const { user } = useAuth();

  let dashboardHref = "/admin/dashboard";
  if (user?.role === "delivery") {
    dashboardHref = "/delivery/dashboard";
  } else if (user?.role === "admin") {
    dashboardHref = "/admin/dashboard";
  }

  return (
    <>
      <Link
        href={dashboardHref}
        className={`dashboard-button ${className}`}
        style={{
          color: currentTheme.text.inverse,
          background: `linear-gradient(135deg, ${currentTheme.interactive.primary}, ${currentTheme.interactive.secondary})`,
          boxShadow: `0 4px 12px ${currentTheme.interactive.primary}40`,
          border: `1px solid ${currentTheme.interactive.primary}30`,
        }}>
        Dashboard
      </Link>
      <style>{`
        .dashboard-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.625rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease-in-out;
          position: relative;
          overflow: hidden;
        }
        .dashboard-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .dashboard-button:hover::before {
          left: 100%;
        }
        .dashboard-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px ${currentTheme.interactive.primary}60;
        }
        .dashboard-button:active {
          transform: translateY(0) scale(1);
        }
      `}</style>
    </>
  );
}
