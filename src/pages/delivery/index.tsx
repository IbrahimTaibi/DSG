import React from "react";
import DeliveryStats from "../../components/delivery/DeliveryStats";
import AssignedDeliveries from "../../components/delivery/AssignedDeliveries";

export default function DeliveryDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Livraison</h1>
      <DeliveryStats />
      <AssignedDeliveries />
    </div>
  );
} 