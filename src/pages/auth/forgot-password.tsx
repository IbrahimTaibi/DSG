import Head from "next/head";
import Link from "next/link";
import { useDarkMode } from "@/contexts/DarkModeContext";
import ForgotPasswordForm from "@/components/forms/auth/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const { currentTheme } = useDarkMode();

  return (
    <>
      <Head>
        <title>Mot de passe oublié - DSG</title>
        <meta
          name="description"
          content="Réinitialisez votre mot de passe DSG"
        />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ backgroundColor: currentTheme.background.primary }}>
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: currentTheme.text.primary }}>
                DSG
              </h1>
            </Link>
            <h2
              className="text-2xl font-semibold"
              style={{ color: currentTheme.text.primary }}>
              Mot de passe oublié
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: currentTheme.text.secondary }}>
              Entrez votre adresse e-mail pour recevoir un lien de
              réinitialisation
            </p>
          </div>

          {/* Forgot Password Form */}
          <div
            className="py-8 px-6 rounded-2xl shadow-lg"
            style={{
              backgroundColor: currentTheme.background.card,
              border: `1px solid ${currentTheme.border.primary}`,
            }}>
            <ForgotPasswordForm />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm" style={{ color: currentTheme.text.muted }}>
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link
                href="/login"
                className="underline hover:no-underline"
                style={{ color: currentTheme.interactive.primary }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
