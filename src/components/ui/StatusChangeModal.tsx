import React from "react";
import Modal from "./Modal";
import { useDarkMode } from "../../contexts/DarkModeContext";

interface StatusOption {
  label: string;
  value: string;
}

interface Theme {
  status: {
    success: string;
    warning: string;
    error: string;
  };
  text: {
    secondary: string;
    inverse: string;
  };
  background: {
    primary: string;
    secondary: string;
    card: string;
  };
  border: {
    primary: string;
  };
}

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  selectedStatus: string;
  options: StatusOption[];
  onChange: (value: string) => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
}

const getStatusColor = (status: string, currentTheme: Theme) => {
  switch (status) {
    case "active":
      return currentTheme.status.success;
    case "inactive":
      return currentTheme.status.warning;
    case "out_of_stock":
    case "discontinued":
      return currentTheme.status.error;
    case "draft":
      return currentTheme.text.secondary;
    default:
      return currentTheme.text.secondary;
  }
};

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  selectedStatus,
  options,
  onChange,
  onConfirm,
  loading = false,
  title = "Changer le statut du produit",
}) => {
  const { currentTheme } = useDarkMode();
  const [hovered, setHovered] = React.useState<string | null>(null);
  const selected =
    options.find((opt) => opt.value === selectedStatus) || options[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mb-8 flex flex-col gap-2">
        {options.map((option) => {
          const isCurrent = option.value === currentStatus;
          const isSelected = option.value === selected.value;
          const isActive = isSelected; // only selected is active
          const isHovered = hovered === option.value;
          const statusColor = getStatusColor(option.value, currentTheme);
          return (
            <button
              key={option.value}
              type="button"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition focus:outline-none
                ${isActive ? "ring-2 ring-offset-2" : ""}
              `}
              style={{
                background: isActive
                  ? statusColor + '15'
                  : isHovered
                  ? currentTheme.background.secondary
                  : currentTheme.background.tertiary,
                color: isActive
                  ? statusColor
                  : currentTheme.text.primary,
                borderColor: isActive
                  ? statusColor
                  : currentTheme.border.primary,
                boxShadow: isActive
                  ? `0 0 0 2px ${statusColor}`
                  : undefined,
                cursor: isCurrent ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading || isCurrent}
              onClick={() => onChange(option.value)}
              onMouseEnter={() => setHovered(option.value)}
              onMouseLeave={() => setHovered(null)}
              aria-current={isCurrent ? "step" : undefined}>
              {/* Status Icon */}
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full border"
                style={{
                  background: isActive
                    ? statusColor
                    : currentTheme.background.card,
                  borderColor: isActive
                    ? statusColor
                    : currentTheme.border.primary,
                }}>
                {isActive ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path
                      d="M4 8l3 3 5-5"
                      stroke={option.value === "draft" ? currentTheme.background.primary : currentTheme.text.inverse}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke={statusColor}
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </span>
              <span
                className="flex-1 text-left font-medium"
                style={{
                  color: isActive
                    ? statusColor
                    : currentTheme.text.primary,
                }}>
                {option.label}
              </span>
              {isSelected && !isCurrent && (
                <span className="ml-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path
                      d="M4 8l3 3 5-5"
                      stroke={statusColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded border"
          style={{
            background: currentTheme.background.primary,
            color: currentTheme.text.secondary,
            borderColor: currentTheme.border.primary,
          }}
          onClick={onClose}
          disabled={loading}>
          Annuler
        </button>
        <button
          className="px-4 py-2 rounded font-semibold shadow-sm"
          style={{
            background: currentTheme.interactive.primary,
            color: currentTheme.text.inverse,
            border: `1.5px solid ${currentTheme.interactive.primary}`,
            opacity: loading || selected.value === currentStatus ? 0.7 : 1,
          }}
          onClick={onConfirm}
          disabled={loading || selected.value === currentStatus}>
          {loading ? "Enregistrement..." : "Confirmer"}
        </button>
      </div>
    </Modal>
  );
};

export default StatusChangeModal;
