import AdminLayout from "@/components/admin/layout/AdminLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import UserForm from "@/components/forms/UserForm";
import React from "react";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

export default function AddUser() {
  const router = useRouter();
  const { currentTheme } = useDarkMode();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddUser = async (userData: UserFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Add new user:", userData);
      // In real implementation, create the user in the backend
      router.push("/admin/users");
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/users");
  };

  return (
    <AdminLayout>
      <SectionHeader
        title="Ajouter un utilisateur"
        subtitle="Créer un nouvel utilisateur dans le système."
      />

      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-6"
          style={{
            background: currentTheme.background.card,
            border: `1px solid ${currentTheme.border.primary}`,
          }}>
          <UserForm
            onSubmit={handleAddUser}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
