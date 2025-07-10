import React, { useState } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface MessageFormData {
  sender: string;
  recipient: string;
  subject: string;
  content: string;
}

interface MessageFormProps {
  onSubmit: (messageData: MessageFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState<MessageFormData>({
    sender: "",
    recipient: "",
    subject: "",
    content: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MessageFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Expéditeur *
          </label>
          <Input
            type="text"
            value={formData.sender}
            onChange={(e) => handleChange("sender", e.target.value)}
            placeholder="Nom de l'expéditeur"
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Destinataire *
          </label>
          <Input
            type="text"
            value={formData.recipient}
            onChange={(e) => handleChange("recipient", e.target.value)}
            placeholder="Nom du destinataire"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Sujet *
          </label>
          <Input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="Sujet du message"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Message *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Contenu du message"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{
              background: currentTheme.background.primary,
              color: currentTheme.text.primary,
              borderColor: currentTheme.border.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
          />
        </div>
      </div>
      <div
        className="flex justify-end gap-3 pt-6 border-t"
        style={{ borderColor: currentTheme.border.primary }}>
        <Button
          type="button"
          onClick={onCancel}
          className="px-6 py-2"
          style={{
            color: currentTheme.text.secondary,
            background: "transparent",
            border: `1px solid ${currentTheme.border.primary}`,
          }}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2"
          style={{
            color: currentTheme.text.inverse,
            background: currentTheme.interactive.primary,
          }}>
          {isLoading ? "Enregistrement..." : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
