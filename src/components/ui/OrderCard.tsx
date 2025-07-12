import { useDarkMode } from "@/contexts/DarkModeContext";
import React from "react";
import { useCurrency } from "@/hooks/useCurrency";

export interface OrderCardProps {
  id: string;
  date: string;
  status: string;
  total: string | number;
  items: { name: string; qty: number }[];
  statusColor?: string;
}

export default function OrderCard({
  id,
  date,
  status,
  total,
  items,
  statusColor,
}: OrderCardProps) {
  const { currentTheme } = useDarkMode();
  const { format } = useCurrency();
  
  const badgeColor = statusColor ||
    (status === "Livré"
      ? currentTheme.status?.success || "#22c55e" // green
      : status === "En cours"
      ? currentTheme.status?.warning || "#eab308" // yellow
      : status === "Annulée"
      ? currentTheme.status?.error || "#ef4444" // red
      : status === "On the way"
      ? currentTheme.status?.info || "#3b82f6" // blue
      : currentTheme.text.muted);
      
  // Format total - handle both string and number inputs
  const formattedTotal = typeof total === 'number' ? format(total) : total;
  
  return (
    <div
      className="rounded-2xl p-6 shadow-sm flex flex-col gap-4 border transition-all hover:shadow-md"
      style={{
        background: currentTheme.background.card,
        borderColor: currentTheme.border.primary,
      }}>
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: currentTheme.text.muted }}>
          Commande #{id}
        </span>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: badgeColor + "22", color: badgeColor }}>
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-sm"
          style={{ color: currentTheme.text.secondary }}>
          {date}
        </span>
        <span
          className="text-lg font-bold"
          style={{ color: currentTheme.text.primary }}>
          {formattedTotal}
        </span>
      </div>
      <ul className="mt-2 flex flex-col gap-1">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between text-sm"
            style={{ color: currentTheme.text.primary }}>
            <span>{item.name}</span>
            <span>x{item.qty}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
