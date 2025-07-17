import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "admin" | "store" | "delivery";
  status: "active" | "inactive" | "suspended" | "deleted";
  orderCount: number;
  createdAt: string;
}

export interface UserFormData {
  name: string;
  email?: string;
  mobile: string;
  password: string;
  role: string;
  status: "active" | "inactive" | "suspended" | "deleted";
}

interface UserFormProps {
  user?: User | null;
  onSubmit: (userData: UserFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  hidePassword?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
  hidePassword = false,
}) => {
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "store",
    status: "active",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        role: user.role,
        status: (user as any).status || "active",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobile.trim() || (!hidePassword && !formData.password.trim())) return; // required
    const payload: any = {
      name: formData.name,
      mobile: formData.mobile,
      role: formData.role,
      status: formData.status,
    };
    if (formData.email && formData.email.trim() !== "") {
      payload.email = formData.email;
    }
    if (formData.password && formData.password.trim() !== "") {
      payload.password = formData.password;
    }
    onSubmit(payload);
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
            Téléphone *
          </label>
          <Input
            type="tel"
            value={formData.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
            placeholder="+216 12 345 678"
            required
          />
        </div>

        {!hidePassword ? (
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: currentTheme.text.primary }}>
              Mot de passe *
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>
        ) : (
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: currentTheme.text.primary }}>
              Nouveau mot de passe
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Laisser vide pour ne pas changer"
            />
          </div>
        )}

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="entrez@email.com"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
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
            <option value="store">Magasin</option>
            <option value="delivery">Livreur</option>
            <option value="admin">Administrateur</option>
            <option value="support">Support</option>
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
            required
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
            <option value="deleted">Supprimé</option>
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
