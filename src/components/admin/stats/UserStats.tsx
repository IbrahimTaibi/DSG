import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

const UserStats: React.FC<UserStatsProps> = ({
  totalUsers,
  activeUsers,
  inactiveUsers,
}) => {
  const { currentTheme } = useDarkMode();

  const stats = [
    {
      label: "Total utilisateurs",
      value: totalUsers,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21v-2a4 4 0 0 0-3-3.87"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: currentTheme.status.info,
    },
    {
      label: "Utilisateurs actifs",
      value: activeUsers,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="22,4 12,14.01 9,11.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: currentTheme.status.success,
    },
    {
      label: "Utilisateurs inactifs",
      value: inactiveUsers,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="15"
            y1="9"
            x2="9"
            y2="15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="9"
            y1="9"
            x2="15"
            y2="15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: currentTheme.status.error,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 lg:p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
          style={{
            background: currentTheme.background.card,
            borderColor: currentTheme.border.primary,
          }}>
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: currentTheme.text.secondary }}>
                {stat.label}
              </p>
              <p
                className="text-2xl lg:text-3xl font-bold mt-2"
                style={{ color: currentTheme.text.primary }}>
                {stat.value}
              </p>
            </div>
            <div
              className="p-2 lg:p-3 rounded-lg"
              style={{ background: stat.color + "15", color: stat.color }}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
