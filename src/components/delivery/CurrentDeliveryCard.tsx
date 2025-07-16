import React from "react";
import DeliveryOrderCard from "@/components/delivery/DeliveryOrderCard";

const CurrentDeliveryCard: React.FC = () => {
  // Placeholder data
  const delivery = {
    orderId: "#1234",
    address: "123 Avenue de la République, Paris",
    status: "En cours",
    customer: "Jean Dupont",
    price: 24.99,
  };

  return (
    <DeliveryOrderCard
      orderId={delivery.orderId}
      address={delivery.address}
      status={delivery.status}
      customer={delivery.customer}
      price={delivery.price}
      actions={
        <>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(delivery.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-base font-semibold text-center"
          >
            Naviguer
          </a>
          <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-base font-semibold">
            Livré
          </button>
        </>
      }
    />
  );
};

export default CurrentDeliveryCard; 