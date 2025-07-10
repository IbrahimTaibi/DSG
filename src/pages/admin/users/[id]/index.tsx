import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/admin/AdminLayout";
import { useDarkMode } from "@/contexts/DarkModeContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import { fetchUserById } from "@/services/userService";

export default function AdminUserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { currentTheme } = useDarkMode();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    orderCount?: number;
    reviewCount?: number;
    favoritesCount?: number;
    totalSpent?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchUserById(id as string)
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch(() => setError("Utilisateur introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
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
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-semibold text-red-500">{error || "Utilisateur introuvable"}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6" style={{ color: currentTheme.text.primary }}>
          Profil de l&apos;utilisateur
        </h1>
        <div className="mb-8">
          <ProfileHeader joinDate={user.createdAt} user={user} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Stats (customize as needed) */}
            <ProfileStats
              stats={{
                orders: user.orderCount || 0,
                reviews: user.reviewCount || 0,
                favorites: user.favoritesCount || 0,
                totalSpent: user.totalSpent || 0,
              }}
            />
          </div>
          {/* Optionally add admin actions here in the future */}
        </div>
      </div>
    </AdminLayout>
  );
} 