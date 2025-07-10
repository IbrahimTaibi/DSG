import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { colors } from "../../../theme";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
// import ErrorMessage from "@/components/ui/ErrorMessage";

const ForgotPasswordForm = () => {
  const { forgotPassword, isLoading } = useAuth();
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.email) {
      setError("Veuillez saisir votre adresse e-mail");
      return;
    }

    const result = await forgotPassword(formData.email);
    if (result.success) {
      setSuccess(true);
      setFormData({ email: "" });
    } else {
      setError(
        result.error || "Une erreur s'est produite lors de l'envoi de l'e-mail",
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
          <h3 className="font-medium mb-2">E-mail envoyé !</h3>
          <p className="text-sm">
            Si un compte existe avec cette adresse e-mail, vous recevrez un lien
            pour réinitialiser votre mot de passe.
          </p>
        </div>
        <div className="text-center space-y-2">
          <Link
            href="/login"
            className="text-sm hover:underline transition-colors"
            style={{ color: currentTheme.text.muted }}>
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Adresse e-mail"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          labelStyle={{ color: currentTheme.text.primary }}
          style={{
            backgroundColor: currentTheme.background.secondary,
            color: currentTheme.text.primary,
            border: `1px solid ${currentTheme.border.primary}`,
            boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
          }}
          placeholder="votre@email.com"
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
          ? "Envoi en cours..."
          : "Envoyer le lien de réinitialisation"}
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

export default ForgotPasswordForm;
