import AdminLayout from "@/components/admin/layout/AdminLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

export default function AdminSettings() {
  const { currentTheme } = useDarkMode();

  return (
    <AdminLayout>
      <SectionHeader
        title="Paramètres administrateur"
        subtitle="Configuration et préférences du site."
      />
      <div
        className="mt-8 overflow-x-auto rounded-lg border p-6"
        style={{
          borderColor: currentTheme.border.primary,
          background: currentTheme.background.card,
        }}>
        <p style={{ color: currentTheme.text.secondary }}>
          Paramètres à venir, utilisez la classe &apos;hover:shadow-md
          hover:text-primary-500 dark:hover:text-accent-500&apos; pour les
          boutons d&apos;action
        </p>
      </div>
    </AdminLayout>
  );
}
