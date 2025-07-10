import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Image from "next/image";

interface Order {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  ref: string;
  status: string;
}

interface DeliveryChatSelectorProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
  onSelectSupport: () => void;
  selectedOrderId?: string;
}

const DeliveryChatSelector: React.FC<DeliveryChatSelectorProps> = ({
  orders,
  onSelectOrder,
  onSelectSupport,
  selectedOrderId,
}) => {
  const { currentTheme } = useDarkMode();
  return (
    <div
      className="w-[95vw] max-w-xs md:max-w-sm rounded-2xl shadow-2xl flex flex-col bg-white dark:bg-[#1e293b]"
      style={{
        background: currentTheme.background.card,
        border: `1.5px solid ${currentTheme.border.primary}`,
        color: currentTheme.text.primary,
      }}>
      <div
        className="px-4 py-3 border-b rounded-t-2xl"
        style={{ borderColor: currentTheme.border.primary }}>
        <span
          className="font-semibold"
          style={{ color: currentTheme.text.primary }}>
          Vos commandes en cours
        </span>
      </div>
      <div className="flex-1 flex flex-col px-2 py-2 gap-2 max-h-72 md:max-h-80 overflow-y-auto">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => onSelectOrder(order.id)}
            className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${
              selectedOrderId === order.id
                ? "border-primary ring-2 ring-primary"
                : "border-transparent"
            }`}
            style={{
              background:
                selectedOrderId === order.id
                  ? currentTheme.background.secondary
                  : currentTheme.background.card,
              borderColor:
                selectedOrderId === order.id
                  ? currentTheme.interactive.primary
                  : "transparent",
            }}>
            <Image
              src={
                order.user.avatar ||
                "https://randomuser.me/api/portraits/men/35.jpg"
              }
              alt={order.user.name}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover border"
              style={{ borderColor: currentTheme.border.primary }}
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className="font-semibold truncate"
                style={{ color: currentTheme.text.primary }}>
                {order.user.name}
              </span>
              <span
                className="text-xs truncate"
                style={{ color: currentTheme.text.muted }}>
                Réf: {order.ref}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: currentTheme.status.success }}>
                {order.status}
              </span>
            </div>
          </button>
        ))}
        <button
          onClick={onSelectSupport}
          className="flex items-center gap-3 p-2 rounded-xl border border-transparent transition-all text-left hover:bg-gray-100 dark:hover:bg-[#334155]"
          style={{ background: currentTheme.background.card }}>
          <span
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg"
            style={{ background: currentTheme.interactive.primary }}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.96 8.96 0 01-4-.93L3 19l1.07-3.21A7.963 7.963 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z"
              />
            </svg>
          </span>
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="font-semibold truncate"
              style={{ color: currentTheme.text.primary }}>
              Admin Support
            </span>
            <span
              className="text-xs truncate"
              style={{ color: currentTheme.text.muted }}>
              Support
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DeliveryChatSelector;
