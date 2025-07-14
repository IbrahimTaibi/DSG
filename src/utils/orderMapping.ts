// src/utils/orderMapping.ts
import { OrderCardProps } from "@/components/ui/OrderCard";
import { formatCurrency } from "@/config/currency";

export interface TimelineStep {
  label: string;
  date: string;
  done: boolean;
}

export function getOrderStatusLabelAndColor(status: string): { label: string; color: string } {
  switch (status) {
    case "pending":
      return { label: "En attente", color: "#eab308" }; // yellow
    case "waiting_for_delivery":
      return { label: "En attente de livraison", color: "#f59e42" }; // orange
    case "delivering":
      return { label: "En cours de livraison", color: "#3b82f6" }; // blue
    case "delivered":
      return { label: "Livré", color: "#22c55e" }; // green
    case "cancelled":
      return { label: "Annulée", color: "#ef4444" }; // red
    case "assigned":
      return { label: "Assignée", color: "#a855f7" }; // purple
    default:
      return { label: status, color: "#6b7280" }; // gray
  }
}

export interface OrderDetails extends OrderCardProps {
  address: string;
  timeline: TimelineStep[];
  statusColor: string;
  statusLabel: string;
}

export function mapBackendOrderToOrderDetails(order: Record<string, unknown>): OrderDetails {
  const { label: statusLabel, color: statusColor } = getOrderStatusLabelAndColor(order.status as string);
  // Timeline logic: you may want to adjust this based on your backend statusHistory
  const timeline: TimelineStep[] = [
    {
      label: "Commande passée",
      date: order.createdAt ? new Date(order.createdAt as string).toLocaleDateString() : "",
      done: true,
    },
    {
      label: "En préparation",
      date: Array.isArray(order.statusHistory) && order.statusHistory.find((s: Record<string, unknown>) => s.status === "pending")?.changedAt
        ? new Date((order.statusHistory.find((s: Record<string, unknown>) => s.status === "pending") as Record<string, unknown>).changedAt as string).toLocaleDateString()
        : "",
      done: ["pending", "delivering", "delivered"].includes(order.status as string),
    },
    {
      label: "En cours de livraison",
      date: Array.isArray(order.statusHistory) && order.statusHistory.find((s: Record<string, unknown>) => s.status === "delivering")?.changedAt
        ? new Date((order.statusHistory.find((s: Record<string, unknown>) => s.status === "delivering") as Record<string, unknown>).changedAt as string).toLocaleDateString()
        : "",
      done: ["delivering", "delivered"].includes(order.status as string),
    },
    {
      label: "Livré",
      date: Array.isArray(order.statusHistory) && order.statusHistory.find((s: Record<string, unknown>) => s.status === "delivered")?.changedAt
        ? new Date((order.statusHistory.find((s: Record<string, unknown>) => s.status === "delivered") as Record<string, unknown>).changedAt as string).toLocaleDateString()
        : "",
      done: order.status === "delivered",
    },
  ];

  // Address formatting
  const address = order.address && typeof order.address === "object"
    ? (() => {
        const addr = order.address as Record<string, string | undefined>;
        return [addr.address, addr.city, addr.state, addr.zipCode]
          .filter((v) => typeof v === 'string' && v.length > 0)
          .join(", ");
      })()
    : "";

  return {
    id: String(order.orderId || order._id || ''),
    date: order.createdAt ? new Date(order.createdAt as string).toLocaleDateString() : "",
    status: statusLabel,
    statusColor,
    statusLabel, // Add this line
    total: order.total ? formatCurrency(order.total as number) : formatCurrency(0),
    items: Array.isArray(order.products)
      ? (order.products as Array<Record<string, unknown>>).map((p) => ({
          name: p.product && typeof p.product === 'object' && 'name' in p.product ? (p.product as Record<string, unknown>).name as string : "Produit inconnu",
          qty: p.quantity as number,
        }))
      : [],
    address,
    timeline,
  };
} 