import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { colors } from "../../theme";

interface OrderDetailsType {
  orderId?: string;
  total?: number;
  status?: string;
  products?: Array<{ product: string; quantity: number; price: number }>;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  details?: OrderDetailsType; // Optional: for expandable details (e.g., order info)
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 3000,
  details,
}) => {
  const { currentTheme } = useDarkMode();
  const [expanded, setExpanded] = React.useState(false);

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
          {details && (
            <button
              className="flex items-center mt-2 text-xs font-medium focus:outline-none"
              style={{ color: currentTheme.interactive.primary }}
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
            >
              <span>{expanded ? "Masquer les détails" : "Afficher les détails"}</span>
              <svg
                className={`ml-1 transition-transform duration-200 ${expanded ? "rotate-180" : "rotate-0"}`}
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {details && expanded && (
            <div className="mt-4 rounded-lg p-3 border text-xs" style={{ background: currentTheme.background.secondary, borderColor: currentTheme.border.primary, color: currentTheme.text.primary }}>
              {typeof details === "object" ? (
                <OrderDetails details={details} />
              ) : (
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{details}</pre>
              )}
            </div>
          )}
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

// Helper component for rendering order details in a structured way
const OrderDetails: React.FC<{ details: OrderDetailsType }> = ({ details }) => {
  if (!details) return null;
  const d = details;
  return (
    <div className="space-y-2">
      {d.orderId && (
        <div><span className="font-semibold">Commande ID:</span> {d.orderId}</div>
      )}
      {d.status && (
        <div><span className="font-semibold">Statut:</span> {d.status}</div>
      )}
      {d.total && (
        <div><span className="font-semibold">Total:</span> ${typeof d.total === 'number' && d.total.toFixed ? d.total.toFixed(2) : d.total}</div>
      )}
      {Array.isArray(d.products) && d.products.length > 0 && (
        <div>
          <div className="font-semibold mb-1">Produits:</div>
          <ul className="list-disc pl-5">
            {d.products.map((prod, idx) => (
              <li key={idx}>
                <span className="font-medium">{prod.product}</span> — Qté: {prod.quantity}, Prix: ${prod.price}
              </li>
            ))}
          </ul>
        </div>
      )}
      {d.address && typeof d.address === "object" && d.address !== null && (
        <div>
          <div className="font-semibold mb-1">Adresse de livraison:</div>
          <div>
            {d.address.address || d.address.city || d.address.state || d.address.zipCode ? (
              [
                d.address.address,
                d.address.city,
                d.address.state,
                d.address.zipCode
              ].filter(Boolean).join(", ")
            ) : (
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{JSON.stringify(d.address, null, 2)}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
