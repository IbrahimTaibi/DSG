import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { colors } from "../../../theme";
import ReactCountryFlag from "react-country-flag";

const RegisterForm = () => {
  const { register, isLoading } = useAuth();
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        password: formData.password,
        role: "store", // Default role for new registrations
      };
      const result = await register(dataToSend);
      if (!result.success) {
        setError(result.error || "Une erreur s'est produite");
      } else {
        // Success handled by parent (page) via redirect
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
              style={{ color: currentTheme.text.primary }}>
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              style={{
                backgroundColor: currentTheme.background.secondary,
                color: currentTheme.text.primary,
                border: `1px solid ${currentTheme.border.primary}`,
                boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
              }}
              placeholder="Votre nom complet"
            />
          </div>
          {/* Mobile Field */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium mb-2"
              style={{ color: currentTheme.text.primary }}>
              Numéro de mobile
            </label>
            <div className="flex items-center w-full overflow-x-hidden">
              <span
                className="flex items-center px-2 md:px-3 py-3 rounded-l-xl border border-r-0 select-none text-sm md:text-base"
                style={{
                  borderColor: currentTheme.border.primary,
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.muted,
                  fontSize: "0.95em",
                  height: "48px",
                  lineHeight: "1.5",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.18em",
                  minWidth: "70px",
                  justifyContent: "center",
                  cursor: "not-allowed",
                  opacity: 0.85,
                }}>
                <ReactCountryFlag
                  countryCode="TN"
                  svg
                  style={{
                    width: "0.85em",
                    height: "0.85em",
                    verticalAlign: "-0.15em",
                    boxShadow: "0 0 1px rgba(0,0,0,0.08)",
                  }}
                  title="Tunisia"
                />
                +216
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: "1px",
                  height: "32px",
                  background: currentTheme.border.primary,
                  opacity: 0.5,
                  marginLeft: "-1px",
                  marginRight: 0,
                  borderRadius: "1px",
                  display: "inline-block",
                }}
              />
              <input
                id="mobile"
                name="mobile"
                type="text"
                autoComplete="tel"
                required
                value={formData.mobile}
                onChange={(e) => {
                  // Only allow digits, max 8 for Tunisia
                  const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setFormData({ ...formData, mobile: value });
                }}
                disabled={isSubmitting}
                className="w-full md:min-w-[180px] px-2 md:px-4 py-3 rounded-r-xl text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 border-l-0"
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                  borderLeft: "none",
                  boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
                  fontWeight: 500,
                  height: "48px",
                  lineHeight: "1.5",
                  transition: "background-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    currentTheme.background.secondary)
                }
                placeholder="XX XXX XXX"
                pattern="\d{8}"
                title="Le numéro tunisien doit comporter 8 chiffres"
              />
            </div>
          </div>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: currentTheme.text.primary }}>
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              style={{
                backgroundColor: currentTheme.background.secondary,
                color: currentTheme.text.primary,
                border: `1px solid ${currentTheme.border.primary}`,
                boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
              }}
              placeholder="votre@email.com"
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
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              required
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
              style={{
                backgroundColor: currentTheme.background.secondary,
                color: currentTheme.text.primary,
                border: `1px solid ${currentTheme.border.primary}`,
                boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
              }}
              placeholder="Votre adresse complète"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium mb-2"
                style={{ color: currentTheme.text.primary }}>
                Ville
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                  boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
                }}
                placeholder="Ville"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="state"
                className="block text-sm font-medium mb-2"
                style={{ color: currentTheme.text.primary }}>
                État / Région
              </label>
              <input
                id="state"
                name="state"
                type="text"
                required
                value={formData.state}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                  boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
                }}
                placeholder="État / Région"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium mb-2"
                style={{ color: currentTheme.text.primary }}>
                Code postal
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                required
                value={formData.zipCode}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                  boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
                }}
                placeholder="Code postal"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: currentTheme.text.primary }}>
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                  boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  color: currentTheme.text.muted,
                  backgroundColor: `${currentTheme.text.muted}20`,
                }}>
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
              style={{ color: currentTheme.text.primary }}>
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                  boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  color: currentTheme.text.muted,
                  backgroundColor: `${currentTheme.text.muted}20`,
                }}>
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div
            className="p-3 rounded-xl text-sm transition-all duration-300 error-message"
            style={{
              backgroundColor: `${colors.error[500]}20`,
              color: colors.error[500],
              border: `1px solid ${colors.error[500]}40`,
            }}>
            {error}
          </div>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.interactive.primary}, ${currentTheme.interactive.primaryHover})`,
            boxShadow: `0 4px 12px ${currentTheme.interactive.primary}40`,
          }}>
          {isSubmitting ? (
            <>
              <svg
                className="-ml-1 mr-3 h-5 w-5 text-white"
                style={{
                  animation: "spin 1s linear infinite",
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création du compte...
            </>
          ) : (
            "Créer mon compte"
          )}
        </button>
        {/* Links */}
        <div className="text-center">
          <div className="text-sm" style={{ color: currentTheme.text.muted }}>
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium hover:underline transition-colors"
              style={{ color: currentTheme.interactive.primary }}>
              Se connecter
            </Link>
          </div>
        </div>
      </form>
      {/* Replace <style jsx> with <style> for error-message animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .error-message {
          animation: fadeInSlideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default RegisterForm;
