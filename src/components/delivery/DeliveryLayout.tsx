import React from "react";
import Header from "@/components/layout/header/Header";
import MainNavBar from "@/components/layout/nav/MainNavBar";
import BottomNavBar from "@/components/layout/nav/BottomNavBar";
import Footer from "@/components/layout/Footer";

const deliveryLinks = [
  {
    name: "Profile",
    href: "/delivery/profile",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    name: "Contactez le Fournisseur",
    href: "/contact",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-4 4H8a4 4 0 01-4-4v-1"
        />
      </svg>
    ),
  },
];

interface DeliveryLayoutProps {
  children: React.ReactNode;
}

const DeliveryLayout: React.FC<DeliveryLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <MainNavBar links={deliveryLinks} />
      <main className="flex-1">{children}</main>
      <BottomNavBar />
      <Footer />
    </div>
  );
};

export default DeliveryLayout; 