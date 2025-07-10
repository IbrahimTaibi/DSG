import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { colors } from "../../theme";

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 3000,
}) => {
  const { currentTheme } = useDarkMode();

  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          background: `${colors.success[500]}15`,
          border: `1px solid ${colors.success[500]}40`,
          iconColor: colors.success[500],
        };
      case "error":
        return {
          background: `${colors.error[500]}15`,
          border: `1px solid ${colors.error[500]}40`,
          iconColor: colors.error[500],
        };
      case "warning":
        return {
          background: `${colors.warning[500]}15`,
          border: `1px solid ${colors.warning[500]}40`,
          iconColor: colors.warning[500],
        };
      case "info":
        return {
          background: `${colors.primary[500]}15`,
          border: `1px solid ${colors.primary[500]}40`,
          iconColor: colors.primary[500],
        };
      default:
        return {
          background: `${colors.primary[500]}15`,
          border: `1px solid ${colors.primary[500]}40`,
          iconColor: colors.primary[500],
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "error":
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "warning":
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "info":
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: currentTheme.background.overlay }}
      onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl shadow-2xl border p-6"
        style={{
          ...typeStyles,
          background: currentTheme.background.card,
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg"
              style={{
                background: `${typeStyles.iconColor}20`,
                color: typeStyles.iconColor,
              }}>
              {getIcon()}
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: currentTheme.text.primary }}>
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{
              color: currentTheme.text.secondary,
              background: currentTheme.text.secondary + "10",
            }}
            aria-label="Fermer">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path
                d="M6 6l8 8M6 14L14 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p
            className="text-sm leading-relaxed"
            style={{ color: currentTheme.text.secondary }}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{
              background: typeStyles.iconColor,
              color: "#ffffff",
              boxShadow: `0 2px 8px ${typeStyles.iconColor}40`,
            }}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
