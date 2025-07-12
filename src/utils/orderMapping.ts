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

export function mapBackendOrderToOrderDetails(order: any): OrderDetails {
  const { label: statusLabel, color: statusColor } = getOrderStatusLabelAndColor(order.status);
  // Timeline logic: you may want to adjust this based on your backend statusHistory
  const timeline: TimelineStep[] = [
    {
      label: "Commande passée",
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "",
      done: true,
    },
    {
      label: "En préparation",
      date: order.statusHistory?.find((s: any) => s.status === "pending")?.changedAt
        ? new Date(order.statusHistory.find((s: any) => s.status === "pending").changedAt).toLocaleDateString()
        : "",
      done: ["pending", "delivering", "delivered"].includes(order.status),
    },
    {
      label: "En cours de livraison",
      date: order.statusHistory?.find((s: any) => s.status === "delivering")?.changedAt
        ? new Date(order.statusHistory.find((s: any) => s.status === "delivering").changedAt).toLocaleDateString()
        : "",
      done: ["delivering", "delivered"].includes(order.status),
    },
    {
      label: "Livré",
      date: order.statusHistory?.find((s: any) => s.status === "delivered")?.changedAt
        ? new Date(order.statusHistory.find((s: any) => s.status === "delivered").changedAt).toLocaleDateString()
        : "",
      done: order.status === "delivered",
    },
  ];

  // Address formatting
  const address = order.address && typeof order.address === "object"
    ? [order.address.address, order.address.city, order.address.state, order.address.zipCode].filter(Boolean).join(", ")
    : "";

  return {
    id: order.orderId || order._id,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "",
    status: statusLabel,
    statusColor,
    statusLabel, // Add this line
    total: order.total ? formatCurrency(order.total) : formatCurrency(0),
    items: Array.isArray(order.products)
      ? order.products.map((p: any) => ({
          name: p.product?.name || "Produit inconnu",
          qty: p.quantity,
        }))
      : [],
    address,
    timeline,
  };
} 