import { useDarkMode } from "@/contexts/DarkModeContext";
import SectionHeader from "@/components/ui/SectionHeader";
import OrderCard, { OrderCardProps } from "@/components/ui/OrderCard";
import React from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "@/utils/cookie";
import { mapBackendOrderToOrderDetails, OrderDetails } from "@/utils/orderMapping";

interface SingleOrderPageProps {
  order: OrderDetails | null;
  error?: string;
}

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

export default function SingleOrderPage({ order, error }: SingleOrderPageProps) {
  const { currentTheme } = useDarkMode();
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center px-2 py-10" style={{ background: currentTheme.background.primary }}>
        <div className="w-full max-w-2xl mx-auto">
          <SectionHeader title="Erreur" subtitle={error} />
        </div>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center px-2 py-10" style={{ background: currentTheme.background.primary }}>
        <div className="w-full max-w-2xl mx-auto">
          <SectionHeader title="Commande introuvable" subtitle="Aucune commande trouvée pour cet identifiant." />
        </div>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen flex flex-col items-center px-2 py-10"
      style={{ background: currentTheme.background.primary }}>
      <div className="w-full max-w-2xl mx-auto">
        <SectionHeader
          title={`Commande #${order.id}`}
          subtitle={`Détails de la commande passée le ${order.date}`}
        />
        <OrderCard {...order} status={order.statusLabel} statusColor={order.statusColor} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["authToken"];
  const orderId = params?.orderId;
  if (!token) {
    return {
      props: {
        order: null,
        error: "Vous devez être connecté pour voir cette commande.",
      },
    };
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"}/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement de la commande.");
    }
    const backendOrder = await response.json();
    const order = mapBackendOrderToOrderDetails(backendOrder);
    return { props: { order } };
  } catch (err: any) {
    return {
      props: {
        order: null,
        error: err.message || "Erreur lors du chargement de la commande.",
      },
    };
  }
};
