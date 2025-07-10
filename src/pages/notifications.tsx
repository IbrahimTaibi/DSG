import React, { useEffect, useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import axios from "axios";

interface Notification {
  _id: string;
  type: string;
  data: { message?: string; [key: string]: unknown };
  read: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const { currentTheme } = useDarkMode();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return setLoading(false);
      try {
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"
          }/api/auth/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setNotifications(response.data.notifications || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div
      className="min-h-screen py-8 px-4 md:px-0 flex flex-col items-center"
      style={{
        background: currentTheme.background.primary,
        color: currentTheme.text.primary,
      }}>
      <div className="w-full max-w-2xl">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: currentTheme.text.primary }}>
          Notifications
        </h1>
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
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-xl p-4 shadow transition border ${
                  notif.read ? "opacity-70" : "bg-blue-50 dark:bg-blue-900/20"
                }`}
                style={{
                  background: currentTheme.background.secondary,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
