import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import LoginForm from "@/components/forms/auth/LoginForm";

const LoginPage = () => {
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
        <title>Connexion - DSG</title>
        <meta name="description" content="Connectez-vous à votre compte DSG" />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ backgroundColor: currentTheme.background.primary }}>
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2
              className="text-2xl font-semibold"
              style={{ color: currentTheme.text.primary }}>
              Connexion
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: currentTheme.text.secondary }}>
              Connectez-vous à votre compte
            </p>
          </div>

          {/* Login Form */}
          <div
            className="py-8 px-6 rounded-2xl shadow-lg"
            style={{
              backgroundColor: currentTheme.background.card,
              border: `1px solid ${currentTheme.border.primary}`,
            }}>
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm" style={{ color: currentTheme.text.muted }}>
              En continuant, vous acceptez nos{" "}
              <Link
                href="/terms"
                className="underline hover:no-underline"
                style={{ color: currentTheme.interactive.primary }}>
                conditions d&apos;utilisation
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
