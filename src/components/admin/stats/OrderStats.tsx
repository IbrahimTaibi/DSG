import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { formatCurrency } from "@/config/currency";

interface OrderStatsProps {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

const OrderStats: React.FC<OrderStatsProps> = ({
  totalOrders,
  pendingOrders,
  completedOrders,
  totalRevenue,
}) => {
  const { currentTheme } = useDarkMode();



  const stats = [
    {
      label: "Total commandes",
      value: totalOrders,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"
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
      label: "Commandes en attente",
      value: pendingOrders,
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
          <polyline
            points="12,6 12,12 16,14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: currentTheme.status.warning,
    },
    {
      label: "Commandes terminées",
      value: completedOrders,
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
      label: "Revenus totaux",
      value: formatCurrency(totalRevenue),
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <line
            x1="12"
            y1="1"
            x2="12"
            y2="23"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: currentTheme.status.success,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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

export default OrderStats;
