import AdminLayout from "@/components/admin/layout/AdminLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import { UserFormData } from "@/components/forms/UserForm";
import UserForm from "@/components/forms/UserForm";
import React from "react";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { fetchUserById } from "@/services/userService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  orderCount: number;
  hasActiveOrder: boolean;
  mobile: string;
}


export default function EditUser() {
  const router = useRouter();
  const { currentTheme } = useDarkMode();
  const { id } = router.query;
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (id && typeof id === "string") {
      setIsLoading(true);
      fetchUserById(id)
        .then((data) => {
          setUser(data);
        })
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleUpdateUser = async (userData: UserFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Update user:", { id: user.id, ...userData });
      // In real implementation, update the user in the backend
      router.push("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/users");
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p style={{ color: currentTheme.text.secondary }}>
              Chargement...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p style={{ color: currentTheme.text.secondary }}>
              Utilisateur non trouvé
            </p>
            <button
              onClick={() => router.push("/admin/users")}
              className="mt-4 px-4 py-2 rounded-lg transition-colors"
              style={{
                background: currentTheme.interactive.primary,
                color: currentTheme.text.inverse,
              }}>
              Retour à la liste
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SectionHeader
        title="Modifier l'utilisateur"
        subtitle={`Modifier les informations de ${user.name}`}
      />

      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-6"
          style={{
            background: currentTheme.background.card,
            border: `1px solid ${currentTheme.border.primary}`,
          }}>
          <UserForm
            user={{
              ...user,
              mobile: user.mobile || "",
              createdAt: (user as any).createdAt ?? "",
              role: user.role as "admin" | "store" | "delivery",
            }}
            onSubmit={handleUpdateUser}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
