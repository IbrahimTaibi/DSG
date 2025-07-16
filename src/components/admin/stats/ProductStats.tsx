import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface ProductStatsProps {
  totalProducts: number;
  activeProducts: number;
  averageRating: number;
  totalStock: number;
}

const ProductStats: React.FC<ProductStatsProps> = ({
  totalProducts,
  activeProducts,
  averageRating,
  totalStock,
}) => {
  const { currentTheme } = useDarkMode();

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const stats = [
    {
      label: "Total produits",
      value: totalProducts,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
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
      label: "Produits actifs",
      value: activeProducts,
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
      label: "Note moyenne",
      value: `${formatRating(averageRating)}/5`,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
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
      label: "Stock total",
      value: totalStock,
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M4 9h16M4 15h16" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      color: currentTheme.status.info,
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

export default ProductStats;
