import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface ProfileStatsProps {
  stats?: {
    orders?: number;
    reviews?: number;
    favorites?: number;
    totalSpent?: number;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const { currentTheme } = useDarkMode();

  const defaultStats = {
    orders: 0,
    reviews: 0,
    favorites: 0,
    totalSpent: 0,
    ...stats,
  };

  const statItems = [
    {
      label: "Commandes",
      value: defaultStats.orders,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      color: "text-blue-500",
    },
    {
      label: "Avis",
      value: defaultStats.reviews,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      color: "text-yellow-500",
    },
    {
      label: "Favoris",
      value: defaultStats.favorites,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      color: "text-red-500",
    },
    {
      label: "Total dépensé",
      value: `${defaultStats.totalSpent.toLocaleString("fr-FR")} €`,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      color: "text-green-500",
    },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: currentTheme.background.secondary,
        border: `1px solid ${currentTheme.border.primary}`,
      }}>
      <div className="mb-6">
        <h3
          className="text-xl font-semibold mb-1"
          style={{ color: currentTheme.text.primary }}>
          Statistiques
        </h3>
        <p className="text-sm" style={{ color: currentTheme.text.muted }}>
          Votre activité sur la plateforme
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: currentTheme.background.tertiary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}>
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-lg ${item.color}`}
                style={{
                  backgroundColor: `${currentTheme.interactive.primary}15`,
                }}>
                {item.icon}
              </div>
            </div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: currentTheme.text.primary }}>
              {item.value}
            </div>
            <div className="text-sm" style={{ color: currentTheme.text.muted }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;
