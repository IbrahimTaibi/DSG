import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  loading?: boolean; // Add loading prop
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  loading = false, // Add loading default
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
      style={{
        background: currentTheme.background.overlay || "rgba(0,0,0,0.5)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`w-full ${sizeClasses[size]} rounded-xl shadow-2xl border relative flex flex-col animate-fade-in`}
        style={{
          background: currentTheme.background.card,
          borderColor: currentTheme.border.primary,
          color: currentTheme.text.primary,
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
          maxHeight: "90vh",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: currentTheme.border.primary }}
        >
          {title && (
            <h2 className="text-lg font-semibold" style={{ color: currentTheme.text.primary }}>
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors focus:outline-none"
            style={{
              color: currentTheme.text.secondary,
              background: currentTheme.text.secondary + "10",
            }}
            aria-label="Fermer"
          >
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
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: "70vh", position: 'relative' }}>
          {children}
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <div className="animate-spin" style={{ width: 32, height: 32, border: '4px solid #ccc', borderTop: `4px solid ${currentTheme.status.info || '#3498db'}`, borderRadius: '50%' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
