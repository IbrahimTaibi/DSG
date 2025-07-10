import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DashboardLayout from "../../components/admin/DashboardLayout";
import UserGrowthChart from "../../components/admin/charts/UserGrowthChart";
import UserRolesPieChart from "../../components/admin/charts/UserRolesPieChart";
import OrderStatsBarChart from "../../components/admin/charts/OrderStatsBarChart";
import RevenueChart from "../../components/admin/charts/RevenueChart";
import ProductPerformanceChart from "../../components/admin/charts/ProductPerformanceChart";
import RecentActivity from "../../components/admin/RecentActivity";
import { useDarkMode } from "../../contexts/DarkModeContext";

// Mock data for charts
const userGrowthData = [
  { month: "Jan", newUsers: 120, totalUsers: 120 },
  { month: "Fév", newUsers: 150, totalUsers: 270 },
  { month: "Mar", newUsers: 180, totalUsers: 450 },
  { month: "Avr", newUsers: 220, totalUsers: 670 },
  { month: "Mai", newUsers: 280, totalUsers: 950 },
  { month: "Juin", newUsers: 320, totalUsers: 1270 },
];

const userRolesData = [
  { name: "Clients", value: 850, color: "#10B981" },
  { name: "Prestataires", value: 320, color: "#3B82F6" },
  { name: "Administrateurs", value: 15, color: "#F59E0B" },
  { name: "Modérateurs", value: 25, color: "#EF4444" },
];

const orderStatsData = [
  { month: "Jan", orders: 45, revenue: 3200, avgOrderValue: 71 },
  { month: "Fév", orders: 52, revenue: 3800, avgOrderValue: 73 },
  { month: "Mar", orders: 61, revenue: 4500, avgOrderValue: 74 },
  { month: "Avr", orders: 78, revenue: 5800, avgOrderValue: 74 },
  { month: "Mai", orders: 89, revenue: 6700, avgOrderValue: 75 },
  { month: "Juin", orders: 95, revenue: 7200, avgOrderValue: 76 },
];

const revenueData = [
  { month: "Jan", revenue: 3200, profit: 2400, expenses: 800 },
  { month: "Fév", revenue: 3800, profit: 2850, expenses: 950 },
  { month: "Mar", revenue: 4500, profit: 3375, expenses: 1125 },
  { month: "Avr", revenue: 5800, profit: 4350, expenses: 1450 },
  { month: "Mai", revenue: 6700, profit: 5025, expenses: 1675 },
  { month: "Juin", revenue: 7200, profit: 5400, expenses: 1800 },
];

const productPerformanceData = [
  { name: "Plomberie", sales: 45, revenue: 3200, rating: 4.8 },
  { name: "Électricité", sales: 38, revenue: 2800, rating: 4.6 },
  { name: "Ménage", sales: 52, revenue: 2100, rating: 4.7 },
  { name: "Jardinage", sales: 29, revenue: 1800, rating: 4.5 },
  { name: "Peinture", sales: 34, revenue: 2400, rating: 4.4 },
];

const recentActivities = [
  {
    id: "1",
    type: "user" as const,
    action: "Nouveau client inscrit",
    description: "Marie Dupont s&apos;est inscrite sur la plateforme",
    timestamp: "Il y a 5 min",
    user: "Système",
  },
  {
    id: "2",
    type: "order" as const,
    action: "Nouvelle commande",
    description: "Commande #1234 pour services de plomberie",
    timestamp: "Il y a 12 min",
    user: "Jean Martin",
  },
  {
    id: "3",
    type: "product" as const,
    action: "Service ajouté",
    description: "Nouveau service de jardinage ajouté",
    timestamp: "Il y a 25 min",
    user: "Pierre Dubois",
  },
  {
    id: "4",
    type: "review" as const,
    action: "Nouvelle évaluation",
    description: "5 étoiles pour le service de ménage",
    timestamp: "Il y a 1h",
    user: "Sophie Bernard",
  },
  {
    id: "5",
    type: "user" as const,
    action: "Prestataire vérifié",
    description: "Documents de Jean Martin approuvés",
    timestamp: "Il y a 2h",
    user: "Admin",
  },
];

export default function Dashboard() {
  const { currentTheme } = useDarkMode();

  return (
    <AdminLayout>
      <div className="admin-content w-full">
        <div
          className="min-h-screen flex flex-col w-full"
          style={{ background: currentTheme.background.primary }}>
          <div className="p-2 sm:p-4 md:p-6 flex-1 overflow-auto w-full">
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: currentTheme.text.primary }}>
                Tableau de bord
              </h1>
              <p
                className="text-base sm:text-lg"
                style={{ color: currentTheme.text.secondary }}>
                Vue d&apos;ensemble de votre plateforme de services locaux
              </p>
            </div>

            <DashboardLayout>
              <div key="user-growth">
                <UserGrowthChart data={userGrowthData} />
              </div>
              <div key="user-roles">
                <UserRolesPieChart data={userRolesData} />
              </div>
              <div key="order-stats">
                <OrderStatsBarChart data={orderStatsData} />
              </div>
              <div key="revenue-chart">
                <RevenueChart data={revenueData} />
              </div>
              <div key="product-performance">
                <ProductPerformanceChart data={productPerformanceData} />
              </div>
              <div key="recent-activity">
                <RecentActivity activities={recentActivities} />
              </div>
            </DashboardLayout>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
