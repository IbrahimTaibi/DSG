import { useDarkMode } from "@/contexts/DarkModeContext";
import SectionHeader from "@/components/ui/SectionHeader";
import OrderCard, { OrderCardProps } from "@/components/ui/OrderCard";
import React from "react";

const mockOrder: OrderCardProps & {
  address: string;
  timeline: { label: string; date: string; done: boolean }[];
} = {
  id: "1001",
  date: "2024-05-01",
  status: "En cours",
  total: "45,00€",
  items: [
    { name: "Eau minérale", qty: 2 },
    { name: "Chips saveur", qty: 1 },
  ],
  address: "12 Rue de Paris, 75001 Paris, France",
  timeline: [
    { label: "Commande passée", date: "2024-05-01", done: true },
    { label: "En préparation", date: "2024-05-01", done: true },
    { label: "En cours de livraison", date: "2024-05-02", done: false },
    { label: "Livré", date: "", done: false },
  ],
};

function OrderTimeline({
  timeline,
}: {
  timeline: { label: string; date: string; done: boolean }[];
}) {
  const { currentTheme } = useDarkMode();
  return (
    <ol className="flex flex-col gap-4 my-6">
      {timeline.map((step, idx) => (
        <li key={idx} className="flex items-center gap-4">
          <span
            className={`w-5 h-5 flex items-center justify-center rounded-full border-2 font-bold text-xs`}
            style={{
              background: step.done
                ? currentTheme.status.success
                : currentTheme.background.secondary,
              borderColor: step.done
                ? currentTheme.status.success
                : currentTheme.border.primary,
              color: step.done ? "white" : currentTheme.text.muted,
            }}>
            {step.done ? "✓" : idx + 1}
          </span>
          <span className="flex-1" style={{ color: currentTheme.text.primary }}>
            {step.label}
          </span>
          <span className="text-xs" style={{ color: currentTheme.text.muted }}>
            {step.date}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function SingleOrderPage() {
  const { currentTheme } = useDarkMode();
  // In real app, fetch order by query.orderId
  const order = mockOrder;
  return (
    <div
      className="min-h-screen flex flex-col items-center px-2 py-10"
      style={{ background: currentTheme.background.primary }}>
      <div className="w-full max-w-2xl mx-auto">
        <SectionHeader
          title={`Commande #${order.id}`}
          subtitle={`Détails de la commande passée le ${order.date}`}
        />
        <OrderCard {...order} />
        <div className="mt-8 mb-4">
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: currentTheme.text.primary }}>
            Suivi de la commande
          </h2>
          <OrderTimeline timeline={order.timeline} />
        </div>
        <div className="mb-4">
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: currentTheme.text.primary }}>
            Adresse de livraison
          </h2>
          <div
            className="rounded-lg p-4 border"
            style={{
              background: currentTheme.background.card,
              borderColor: currentTheme.border.primary,
              color: currentTheme.text.primary,
            }}>
            {order.address}
          </div>
        </div>
        <div className="mb-4">
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: currentTheme.text.primary }}>
            Résumé
          </h2>
          <ul className="mb-2">
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between text-sm"
                style={{ color: currentTheme.text.primary }}>
                <span>{item.name}</span>
                <span>x{item.qty}</span>
              </li>
            ))}
          </ul>
          <div
            className="flex justify-between font-bold text-base"
            style={{ color: currentTheme.text.primary }}>
            <span>Total</span>
            <span>{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
