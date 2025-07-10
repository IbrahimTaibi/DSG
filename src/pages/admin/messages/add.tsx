import AdminLayout from "@/components/admin/AdminLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import React from "react";
import { useRouter } from "next/router";
import { useDarkMode } from "@/contexts/DarkModeContext";
import MessageForm from "@/components/forms/MessageForm";

interface MessageFormData {
  sender: string;
  recipient: string;
  subject: string;
  content: string;
}

export default function AddMessage() {
  const router = useRouter();
  const { currentTheme } = useDarkMode();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddMessage = async (messageData: MessageFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Add new message:", messageData);
      // In real implementation, create the message in the backend
      router.push("/admin/messages");
    } catch (error) {
      console.error("Error adding message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/messages");
  };

  return (
    <AdminLayout>
      <SectionHeader
        title="Ajouter un message"
        subtitle="Créer un nouveau message dans le système."
      />

      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-6"
          style={{
            background: currentTheme.background.card,
            border: `1px solid ${currentTheme.border.primary}`,
          }}>
          <MessageForm
            onSubmit={handleAddMessage}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
