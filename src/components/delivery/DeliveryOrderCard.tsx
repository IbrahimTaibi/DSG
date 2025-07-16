import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface Product {
  name: string;
  quantity: number;
}

interface DeliveryOrderCardProps {
  orderId: string;
  address: string;
  status: string;
  customer: string;
  price?: number;
  products?: Product[];
  actions?: React.ReactNode;
}

const DeliveryOrderCard: React.FC<DeliveryOrderCardProps> = ({
  orderId,
  address,
  status,
  customer,
  price,
  products,
  actions,
}) => {
  const { currentTheme } = useDarkMode();

  // Determine badge color based on status
  let badgeColor = currentTheme.status.info;
  if (status.toLowerCase().includes("attente")) {
    badgeColor = currentTheme.status.warning;
  } else if (status.toLowerCase().includes("livré") || status.toLowerCase().includes("ramassé")) {
    badgeColor = currentTheme.status.success;
  }

  return (
    <div
      className="rounded-2xl shadow-lg p-4 flex flex-col gap-3 w-full mb-4"
      style={{
        background: currentTheme.background.card,
        color: currentTheme.text.primary,
        border: `1px solid ${currentTheme.border.primary}`,
      }}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">Livraison {orderId}</span>
        <span
          className="text-xs px-2 py-1 rounded-full"
          style={{
            background: badgeColor + "22",
            color: badgeColor,
          }}
        >
          {status}
        </span>
      </div>
      <div className="text-base font-medium">{address}</div>
      {typeof price === "number" && (
        <div className="text-base font-semibold" style={{ color: currentTheme.text.primary }}>
          Prix: {price.toFixed(2)} €
        </div>
      )}
      <div className="text-sm text-gray-500 dark:text-gray-400">Client: {customer}</div>
      {products && products.length > 0 && (
        <ul className="text-sm text-gray-700 dark:text-gray-300 mb-1">
          {products.map((product, idx) => (
            <li key={idx}>
              {product.name} <span className="font-semibold">×{product.quantity}</span>
            </li>
          ))}
        </ul>
      )}
      {actions && <div className="flex gap-2 mt-2">{actions}</div>}
    </div>
  );
};

export default DeliveryOrderCard; 