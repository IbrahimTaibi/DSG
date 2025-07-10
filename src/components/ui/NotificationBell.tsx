import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface NotificationBellProps {
  onClick?: () => void;
  unreadCount?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  onClick,
  unreadCount = 0,
  className = "",
  style = {},
  ariaLabel = "Notifications",
}) => {
  const { currentTheme } = useDarkMode();

  return (
    <button
      onClick={onClick}
      className={`relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${className}`}
      style={{
        backgroundColor: currentTheme.background.secondary,
        color: currentTheme.text.secondary,
        border: `1px solid ${currentTheme.border.primary}`,
        ...style,
      }}
      aria-label={ariaLabel}>
      {/* Bell Icon */}
      <svg
        className="w-5 h-5 md:w-6 md:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {/* Unread badge */}
      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow"
          style={{
            border: `2px solid ${currentTheme.background.secondary}`,
            minWidth: 18,
            textAlign: "center",
          }}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
