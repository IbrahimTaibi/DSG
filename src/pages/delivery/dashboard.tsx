import React from "react";
import CurrentDeliveryCard from "../../components/delivery/CurrentDeliveryCard";
import WaitingForPickupOrders from "@/components/delivery/WaitingForPickupOrders";
import { useDarkMode } from "@/contexts/DarkModeContext";

export default function DeliveryDashboard() {
  const { currentTheme } = useDarkMode();

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center px-2 pt-4 pb-24"
      style={{ background: currentTheme.background.primary }}
    >
      {/* Header */}
      <h1
        className="text-2xl font-bold mb-4 w-full text-center"
        style={{ color: currentTheme.text.primary }}
      >
        Tableau de bord Livraison
      </h1>
      {/* Quick Stats */}
      {/* <div className="w-full mb-4">
        <DeliveryStats />
      </div> */}
      {/* Current Delivery Card (driving aware) */}
      <div className="w-full max-w-md mb-4">
        <CurrentDeliveryCard />
      </div>
      <WaitingForPickupOrders />
      {/* Safety Reminder */}
      <div className="w-full max-w-md text-center text-sm mt-2" style={{ color: currentTheme.status.warning }}>
        🚗 Pour votre sécurité, n&apos;utilisez l&apos;application qu&apos;à l&apos;arrêt.
      </div>
    </div>
  );
} 