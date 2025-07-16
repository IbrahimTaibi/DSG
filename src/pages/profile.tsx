import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileActions from "@/components/profile/ProfileActions";
import ErrorPage from "@/components/ui/ErrorPage";
import { useUserStats, useStoreStats } from "@/hooks/useStats";
import Link from "next/link";

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { currentTheme } = useDarkMode();
  const [refreshKey, setRefreshKey] = useState(0);

  // Always call hooks unconditionally
  const { stats: userStats, refresh: refreshUserStats } = useUserStats();
  const { stats: storeStats, loading: storeStatsLoading } = useStoreStats();
  const isStore = user?.role === "store";

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.replace("/");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    // Use replace to prevent back navigation to profile after logout
    router.replace("/");
  };

  const handleProfileUpdate = () => {
    // Trigger a refresh of the profile data
    setRefreshKey((prev) => prev + 1);
    refreshUserStats();
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: currentTheme.background.primary }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: currentTheme.interactive.primary }}
          />
          <div
            className="text-lg font-medium"
            style={{ color: currentTheme.text.primary }}>
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role === "admin") {
    return (
      <ErrorPage
        title="Accès non autorisé"
        message="Les administrateurs doivent utiliser le Dashboard pour gérer la plateforme."
        errorCode="403"
        backgroundColor={currentTheme.background.primary}
        textColor={currentTheme.text.primary}
        action={
          <Link
            href="/admin/dashboard"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: currentTheme.interactive.primary,
              color: currentTheme.text.inverse,
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            Aller au Dashboard
          </Link>
        }
      />
    );
  }

  if (user?.role === "delivery") {
    // Redirect handled in _app.tsx, so just return null
    return null;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: currentTheme.background.primary }}>
      {/* Header Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${currentTheme.interactive.primary} 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: currentTheme.text.primary }}>
              Mon Profil
            </h1>
            <p className="text-lg" style={{ color: currentTheme.text.muted }}>
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          {/* Profile Header */}
          <div className="mb-8">
            <ProfileHeader key={refreshKey} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form and Stats */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Form */}
              <ProfileForm onSuccess={handleProfileUpdate} />

              {/* Profile Stats */}
              <ProfileStats stats={isStore ? userStats : { orders: 0, reviews: 0, favorites: 0, totalSpent: 0 }} />
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-1">
              <ProfileActions onLogout={handleLogout} />
            </div>
          </div>

          {/* Additional Sections for Different User Roles */}
          {user?.role === "store" && (
            <div className="mt-8">
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3
                      className="text-xl font-semibold mb-1"
                      style={{ color: currentTheme.text.primary }}>
                      Gestion du Magasin
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: currentTheme.text.muted }}>
                      Gérez vos produits et commandes
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/admin")}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: currentTheme.interactive.primary,
                      color: "white",
                    }}>
                    Accéder au Dashboard
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      backgroundColor: currentTheme.background.tertiary,
                      border: `1px solid ${currentTheme.border.primary}`,
                    }}>
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: currentTheme.text.primary }}>
                      {storeStatsLoading ? (
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 rounded"></div>
                      ) : (
                        storeStats.activeProducts
                      )}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: currentTheme.text.muted }}>
                      Produits actifs
                    </div>
                  </div>
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      backgroundColor: currentTheme.background.tertiary,
                      border: `1px solid ${currentTheme.border.primary}`,
                    }}>
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: currentTheme.text.primary }}>
                      {storeStatsLoading ? (
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 rounded"></div>
                      ) : (
                        storeStats.pendingOrders
                      )}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: currentTheme.text.muted }}>
                      Commandes en cours
                    </div>
                  </div>
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      backgroundColor: currentTheme.background.tertiary,
                      border: `1px solid ${currentTheme.border.primary}`,
                    }}>
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: currentTheme.text.primary }}>
                      {storeStatsLoading ? (
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 rounded"></div>
                      ) : (
                        storeStats.averageRating.toFixed(1)
                      )}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: currentTheme.text.muted }}>
                      Note moyenne
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
