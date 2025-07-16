import React from "react";
import DeliveryOrderCard from "@/components/delivery/DeliveryOrderCard";
import { useDarkMode } from "@/contexts/DarkModeContext";

const waitingOrders = [
  {
    orderId: "#5678",
    address: "45 Rue de Lyon, Paris",
    customer: "Marie Curie",
    status: "En attente de ramassage",
    products: [
      { name: "Baguette", quantity: 2 },
      { name: "Croissant", quantity: 6 },
    ],
  },
  {
    orderId: "#5680",
    address: "22 Avenue Victor Hugo, Paris",
    customer: "Louis Pasteur",
    status: "En attente de ramassage",
    products: [
      { name: "Pain au chocolat", quantity: 4 },
    ],
  },
];

const WaitingForPickupOrders: React.FC = () => {
  const { currentTheme } = useDarkMode();
  return (
    <div className="w-full max-w-md mb-4">
      <h2 className="text-lg font-bold mb-2" style={{ color: currentTheme.text.primary }}>À ramasser</h2>
      {waitingOrders.length === 0 ? (
        <div className="text-gray-500 text-center">Aucune commande à ramasser.</div>
      ) : (
        waitingOrders.map((order) => (
          <DeliveryOrderCard
            key={order.orderId}
            orderId={order.orderId}
            address={order.address}
            status={order.status}
            customer={order.customer}
            products={order.products}
            actions={
              <>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-base font-semibold text-center"
                >
                  Naviguer
                </a>
                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-base font-semibold">
                  Ramassé
                </button>
              </>
            }
          />
        ))
      )}
    </div>
  );
};

export default WaitingForPickupOrders; 