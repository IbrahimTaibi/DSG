import { useDarkMode } from "@/contexts/DarkModeContext";
import SectionHeader from "@/components/ui/SectionHeader";
import OrderCard, { OrderCardProps } from "@/components/ui/OrderCard";
import Link from "next/link";
import React from "react";

const mockOrders: OrderCardProps[] = [
  {
    id: "1001",
    date: "2024-05-01",
    status: "Livré",
    total: "45,00€",
    items: [
      { name: "Eau minérale", qty: 2 },
      { name: "Chips saveur", qty: 1 },
    ],
  },
  {
    id: "1002",
    date: "2024-05-03",
    status: "En cours",
    total: "22,50€",
    items: [{ name: "Biscuits sucrés", qty: 3 }],
  },
  {
    id: "1003",
    date: "2024-05-05",
    status: "Annulée",
    total: "0,00€",
    items: [{ name: "Jus d'orange", qty: 1 }],
  },
];

export default function OrdersPage() {
  const { currentTheme } = useDarkMode();
  return (
    <div
      className="min-h-screen flex flex-col items-center px-2 py-10"
      style={{ background: currentTheme.background.primary }}>
      <div className="w-full max-w-3xl mx-auto">
        <SectionHeader
          title="Mes commandes"
          subtitle={
            "Consultez l&rsquo;historique et le statut de vos commandes."
          }
        />
        {mockOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <svg
              width="80"
              height="80"
              fill="none"
              viewBox="0 0 80 80"
              className="mb-6">
              <circle cx="40" cy="40" r="38" stroke="#e5e7eb" strokeWidth="4" />
              <path
                d="M25 40h30M40 25v30"
                stroke="#e5e7eb"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <p
              className="text-lg font-medium"
              style={{ color: currentTheme.text.secondary }}>
              Vous n&apos;avez pas encore de commandes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                style={{ textDecoration: "none" }}
                className="group">
                <OrderCard {...order} />
              </Link>
            ))}
          </div>
        )}
      </div>
      <style jsx global>{`
        .group:hover .rounded-2xl {
          box-shadow: 0 4px 24px 0 ${mockOrders[0] ? "#00000022" : "#00000011"};
          transform: translateY(-2px) scale(1.01);
        }
      `}</style>
    </div>
  );
}
