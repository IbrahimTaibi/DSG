import React, { useEffect, useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useNotifications } from "../contexts/NotificationContext";

interface Notification {
  _id: string;
  type: string;
  data: { message?: string; [key: string]: unknown };
  read: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const { currentTheme } = useDarkMode();
  const { notifications, fetchNotifications } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await fetchNotifications();
      } catch {
        // Error handled by context
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, [fetchNotifications]);

  return (
    <div
      className="min-h-screen py-8 px-4 md:px-0 flex flex-col items-center"
      style={{
        background: currentTheme.background.primary,
        color: currentTheme.text.primary,
      }}>
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: currentTheme.text.primary }}>
            Notifications
          </h1>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div
              className="rounded-xl p-6 text-center text-lg"
              style={{ color: currentTheme.text.muted }}>
              Chargement...
            </div>
          ) : notifications.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center text-lg"
              style={{
                background: currentTheme.background.secondary,
                color: currentTheme.text.muted,
                border: `1px solid ${currentTheme.border.primary}`,
              }}>
              Aucune notification pour le moment.
            </div>
          ) : (
            notifications.map((notif) => {
              const isExpanded = expandedId === notif._id;
              return (
                <div
                  key={notif._id}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-xl p-4 shadow transition border ${
                    notif.read ? "opacity-70" : "bg-blue-50 dark:bg-blue-900/20"
                  }`}
                  style={{
                    background: currentTheme.background.secondary,
                    border: `1px solid ${currentTheme.border.primary}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : notif._id)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                >
                  <div className="flex-1 flex items-start gap-3">
                    {/* Icon based on type */}
                    <div className="pt-1">
                      {notif.type === "order" ? (
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7h18M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6"
                          />
                        </svg>
                      ) : notif.type === "system" ? (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth={2} />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-semibold mb-1"
                        style={{
                          color: notif.read
                            ? currentTheme.text.muted
                            : currentTheme.text.primary,
                        }}>
                        {notif.data?.message || notif.type}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: currentTheme.text.muted }}>
                        {new Date(notif.createdAt).toLocaleString("fr-FR")}
                      </div>
                    </div>
                  </div>
                  {!notif.read && (
                    <span className="inline-block bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2">
                      Nouveau
                    </span>
                  )}
                  {/* Expandable details */}
                  {isExpanded && notif.type === "order_confirmation" && (
                    <div className="mt-4 w-full rounded-lg p-3 border text-xs" style={{ background: currentTheme.background.card, borderColor: currentTheme.border.primary, color: currentTheme.text.primary }}>
                      <OrderNotificationDetails details={notif.data} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

// Define the type for order details
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

// Helper component for rendering order details in a structured way
const OrderNotificationDetails: React.FC<{ details: OrderDetailsType }> = ({ details }) => {
  if (!details) return null;
  return (
    <div className="space-y-2">
      {details.orderId && (
        <div><span className="font-semibold">Commande ID:</span> {details.orderId}</div>
      )}
      {details.status && (
        <div><span className="font-semibold">Statut:</span> {details.status}</div>
      )}
      {details.total && (
        <div><span className="font-semibold">Total:</span> ${typeof details.total === 'number' && details.total.toFixed ? details.total.toFixed(2) : details.total}</div>
      )}
      {Array.isArray(details.products) && details.products.length > 0 && (
        <div>
          <div className="font-semibold mb-1">Produits:</div>
          <ul className="list-disc pl-5">
            {details.products.map((prod, idx) => (
              <li key={idx}>
                <span className="font-medium">{prod.product}</span> — Qté: {prod.quantity}, Prix: ${prod.price}
              </li>
            ))}
          </ul>
        </div>
      )}
      {details.address && typeof details.address === 'object' && details.address !== null && (
        <div>
          <div className="font-semibold mb-1">Adresse de livraison:</div>
          <div>{[details.address.address, details.address.city, details.address.state, details.address.zipCode].filter(Boolean).join(', ')}</div>
        </div>
      )}
    </div>
  );
};
