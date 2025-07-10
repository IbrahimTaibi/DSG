import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import ResetPasswordForm from "@/components/forms/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { currentTheme } = useDarkMode();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (user) {
    return null; // Don't render while redirecting
  }

  return (
    <>
      <Head>
        <title>Réinitialiser le mot de passe - DSG</title>
        <meta
          name="description"
          content="Définissez votre nouveau mot de passe DSG"
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
              Réinitialiser le mot de passe
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: currentTheme.text.secondary }}>
              Définissez votre nouveau mot de passe
            </p>
          </div>

          {/* Reset Password Form */}
          <div
            className="py-8 px-6 rounded-2xl shadow-lg"
            style={{
              backgroundColor: currentTheme.background.card,
              border: `1px solid ${currentTheme.border.primary}`,
            }}>
            <ResetPasswordForm />
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

export default ResetPasswordPage;
