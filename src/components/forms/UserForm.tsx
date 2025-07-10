import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

interface UserFormProps {
  user?: User | null;
  onSubmit: (userData: UserFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Nom complet *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Entrez le nom complet"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Email *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="entrez@email.com"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Rôle *
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{
              background: currentTheme.background.primary,
              color: currentTheme.text.primary,
              borderColor: currentTheme.border.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
            required>
            <option value="user">Utilisateur</option>
            <option value="provider">Fournisseur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Statut *
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{
              background: currentTheme.background.primary,
              color: currentTheme.text.primary,
              borderColor: currentTheme.border.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
            required>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
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
          {isLoading ? "Enregistrement..." : user ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
