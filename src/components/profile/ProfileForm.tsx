import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { colors } from "@/theme";

interface ProfileFormProps {
  onSuccess?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { user, updateUser } = useAuth();
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      let addressString = "";
      if (typeof user.address === "string") {
        addressString = user.address;
      } else if (user.address && typeof user.address === "object") {
        addressString = [user.address.address, user.address.city, user.address.state, user.address.zipCode].filter(Boolean).join(", ");
      }
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: addressString,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setError("Le nom ne peut pas être vide");
      setIsSubmitting(false);
      return;
    }

    try {
      const updatePayload: { name: string; mobile?: string } = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim() || undefined,
      };
      // Do not include address if it's not an object
      await updateUser(updatePayload);
      setSuccess("Profil mis à jour avec succès");
      setIsEditing(false);
      onSuccess?.();
    } catch {
      setError("Erreur lors de la mise à jour du profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "store":
        return "Magasin";
      case "admin":
        return "Administrateur";
      case "delivery":
        return "Livreur";
      default:
        return "Utilisateur";
    }
  };

  return (
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
            Informations personnelles
          </h3>
          <p className="text-sm" style={{ color: currentTheme.text.muted }}>
            Gérez vos informations de profil
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setError("");
            setSuccess("");
          }}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
          style={{
            backgroundColor: isEditing
              ? colors.error[500]
              : currentTheme.interactive.primary,
            color: "white",
          }}>
          {isEditing ? "Annuler" : "Modifier"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Nom complet *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing || isSubmitting}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            style={{
              backgroundColor: currentTheme.background.tertiary,
              color: currentTheme.text.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
            placeholder="Votre nom complet"
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Adresse e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            style={{
              backgroundColor: currentTheme.background.tertiary,
              color: currentTheme.text.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
          />
          <p
            className="text-xs mt-1"
            style={{ color: currentTheme.text.muted }}>
            L&apos;adresse e-mail ne peut pas être modifiée
          </p>
        </div>

        {/* Mobile Field */}
        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Numéro de téléphone
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            disabled={!isEditing || isSubmitting}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            style={{
              backgroundColor: currentTheme.background.tertiary,
              color: currentTheme.text.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
            placeholder="Votre numéro de téléphone"
          />
        </div>

        {/* Address Field */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Adresse
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing || isSubmitting}
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 resize-none"
            style={{
              backgroundColor: currentTheme.background.tertiary,
              color: currentTheme.text.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
            placeholder="Votre adresse complète"
          />
        </div>

        {/* Role Field (Read-only) */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.text.primary }}>
            Type de compte
          </label>
          <input
            id="role"
            name="role"
            type="text"
            value={getRoleLabel(user?.role)}
            disabled
            className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            style={{
              backgroundColor: currentTheme.background.tertiary,
              color: currentTheme.text.primary,
              border: `1px solid ${currentTheme.border.primary}`,
            }}
          />
          <p
            className="text-xs mt-1"
            style={{ color: currentTheme.text.muted }}>
            Le type de compte ne peut pas être modifié
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-4 rounded-xl text-sm flex items-center"
            style={{
              backgroundColor: `${colors.error[500]}15`,
              color: colors.error[500],
              border: `1px solid ${colors.error[500]}30`,
            }}>
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            className="p-4 rounded-xl text-sm flex items-center"
            style={{
              backgroundColor: `${colors.success[500]}15`,
              color: colors.success[500],
              border: `1px solid ${colors.success[500]}30`,
            }}>
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {success}
          </div>
        )}

        {/* Submit Button */}
        {isEditing && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.interactive.primary}, ${currentTheme.interactive.primaryHover})`,
              boxShadow: `0 4px 12px ${currentTheme.interactive.primary}40`,
            }}>
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sauvegarde en cours...
              </span>
            ) : (
              "Sauvegarder les modifications"
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
