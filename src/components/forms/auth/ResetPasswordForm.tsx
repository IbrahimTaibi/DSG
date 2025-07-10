import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { colors } from "../../../theme";
import PasswordInput from "../../ui/PasswordInput";
import Button from "../../ui/Button";
// import ErrorMessage from "@/components/ui/ErrorMessage";

const ResetPasswordForm = () => {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const { id, token } = router.query;
    if (!id || !token) {
      setError("Lien de réinitialisation invalide ou incomplet");
      return;
    }

    const result = await resetPassword(
      id as string,
      token as string,
      formData.password,
    );
    if (result.success) {
      setSuccess(true);
      setFormData({ password: "", confirmPassword: "" });
    } else {
      setError(
        result.error || "Une erreur s'est produite lors de la réinitialisation",
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <div className="mt-8 space-y-6">
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: `${colors.success[500]}20`,
            color: colors.success[500],
            border: `1px solid ${colors.success[500]}40`,
          }}>
          <h3 className="font-medium mb-2">Mot de passe mis à jour !</h3>
          <p className="text-sm">
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez
            maintenant vous connecter avec votre nouveau mot de passe.
          </p>
        </div>
        <div className="text-center space-y-2">
          <Link
            href="/login"
            className="text-sm hover:underline transition-colors"
            style={{ color: currentTheme.text.muted }}>
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <PasswordInput
          id="password"
          name="password"
          label="Nouveau mot de passe"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          labelStyle={{ color: currentTheme.text.primary }}
          style={{
            backgroundColor: currentTheme.background.secondary,
            color: currentTheme.text.primary,
            border: `1px solid ${currentTheme.border.primary}`,
            boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
          }}
          placeholder="••••••••"
        />
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmer le mot de passe"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          labelStyle={{ color: currentTheme.text.primary }}
          style={{
            backgroundColor: currentTheme.background.secondary,
            color: currentTheme.text.primary,
            border: `1px solid ${currentTheme.border.primary}`,
            boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
          }}
          placeholder="••••••••"
        />
      </div>
      {/* Error message */}
      {error && (
        <div
          style={{
            backgroundColor: `${colors.error[500]}20`,
            color: colors.error[500],
            border: `1px solid ${colors.error[500]}40`,
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 8,
            fontWeight: 500,
            fontSize: 14,
          }}>
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.interactive.primary}, ${currentTheme.interactive.primaryHover})`,
          boxShadow: `0 4px 12px ${currentTheme.interactive.primary}40`,
        }}>
        {isLoading
          ? "Mise à jour en cours..."
          : "Réinitialiser le mot de passe"}
      </Button>
      <div className="text-center space-y-2">
        <Link
          href="/login"
          className="text-sm hover:underline transition-colors"
          style={{ color: currentTheme.text.muted }}>
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
