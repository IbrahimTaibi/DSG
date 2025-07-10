import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

// Simple skeleton loader
const SkeletonLoader: React.FC<{ height?: string; width?: string; className?: string }> = ({ height = "1.5rem", width = "100%", className = "" }) => (
  <div
    className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
    style={{ height, width }}
  />
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  loading = false,
}) => {
  const { currentTheme } = useDarkMode();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: currentTheme.background.overlay }}>
      <div
        className={`w-full ${sizeClasses[size]} rounded-xl shadow-2xl border`}
        style={{
          background: currentTheme.background.card,
          borderColor: currentTheme.border.primary,
        }}>
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: currentTheme.border.primary }}>
          <h2
            className="text-lg font-semibold"
            style={{ color: currentTheme.text.primary }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
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
        {/* Content */}
        <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            <SkeletonLoader height="2rem" width="80%" />
            <SkeletonLoader height="1.2rem" width="100%" />
            <SkeletonLoader height="1.2rem" width="90%" />
            <SkeletonLoader height="1.2rem" width="95%" />
            <SkeletonLoader height="1.2rem" width="60%" />
          </div>
        ) : (
          children
        )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
