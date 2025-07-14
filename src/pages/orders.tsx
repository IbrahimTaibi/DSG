import { useDarkMode } from "@/contexts/DarkModeContext";
import SectionHeader from "@/components/ui/SectionHeader";
import OrderCard, { OrderCardProps } from "@/components/ui/OrderCard";
import Link from "next/link";
import React from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "@/utils/cookie";

interface OrdersPageProps {
  orders: OrderCardProps[];
  error?: string;
}

export default function OrdersPage({ orders, error }: OrdersPageProps) {
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
        {error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-lg font-medium text-red-500">{error}</p>
          </div>
        ) : orders.length === 0 ? (
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
            {orders.map((order) => (
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
          box-shadow: 0 4px 24px 0 ${orders[0] ? "#00000022" : "#00000011"};
          transform: translateY(-2px) scale(1.01);
        }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["authToken"];
  if (!token) {
    return {
      props: {
        orders: [],
        error: "Vous devez être connecté pour voir vos commandes.",
      },
    };
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"}/api/orders/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des commandes.");
    }
    const backendOrders = await response.json();
    const orders: OrderCardProps[] = Array.isArray(backendOrders)
      ? backendOrders.map((order: Record<string, unknown>) => ({
          id: String(order.orderId || order._id || ''),
          date: order.createdAt && typeof order.createdAt === 'string' ? new Date(order.createdAt).toLocaleDateString() : "",
          status:
            order.status === "delivered"
              ? "Livré"
              : order.status === "pending"
              ? "En cours"
              : order.status === "cancelled"
              ? "Annulée"
              : (order.status as string),
          total: typeof order.total === 'number' ? order.total : 0,
          items: Array.isArray(order.products)
            ? order.products.map((p: Record<string, unknown>) => ({
                name: p.product && typeof p.product === 'object' && 'name' in p.product ? (p.product as { name?: string }).name || "Produit inconnu" : "Produit inconnu",
                qty: typeof p.quantity === 'number' ? p.quantity : 0,
              }))
            : [],
        }))
      : [];
    return { props: { orders } };
  } catch (err: unknown) {
    let errorMsg = "Erreur lors du chargement des commandes.";
    if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: string }).message === 'string') {
      errorMsg = (err as { message: string }).message;
    }
    return {
      props: {
        orders: [],
        error: errorMsg,
      },
    };
  }
};
