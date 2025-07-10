import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useDarkMode } from "@/contexts/DarkModeContext";

export default function TermsPage() {
  const { currentTheme } = useDarkMode();

  return (
    <>
      <Head>
        <title>Conditions d&apos;utilisation - DSG</title>
        <meta name="description" content="Conditions d'utilisation de DSG" />
      </Head>

      <div
        className="min-h-screen px-4 py-12"
        style={{ backgroundColor: currentTheme.background.primary }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
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
              Conditions d&apos;utilisation
            </h2>
          </div>

          {/* Content */}
          <div
            className="rounded-2xl shadow-lg p-8"
            style={{
              backgroundColor: currentTheme.background.card,
              border: `1px solid ${currentTheme.border.primary}`,
            }}>
            <div
              className="prose max-w-none"
              style={{ color: currentTheme.text.primary }}>
              <h3 className="text-xl font-semibold mb-4">
                1. Acceptation des conditions
              </h3>
              <p className="mb-4">
                En utilisant DSG, vous acceptez d&apos;être lié par ces
                conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces
                conditions, veuillez ne pas utiliser notre service.
              </p>

              <h3 className="text-xl font-semibold mb-4">
                2. Description du service
              </h3>
              <p className="mb-4">
                DSG est une plateforme de services locaux qui met en relation
                des utilisateurs avec des prestataires de services qualifiés.
              </p>

              <h3 className="text-xl font-semibold mb-4">
                3. Utilisation du service
              </h3>
              <p className="mb-4">
                Vous vous engagez à utiliser le service de manière légale et
                éthique. Vous ne devez pas utiliser le service pour des
                activités illégales ou nuisibles.
              </p>

              <h3 className="text-xl font-semibold mb-4">4. Confidentialité</h3>
              <p className="mb-4">
                Nous nous engageons à protéger votre vie privée conformément à
                notre politique de confidentialité.
              </p>

              <h3 className="text-xl font-semibold mb-4">5. Responsabilité</h3>
              <p className="mb-4">
                DSG agit comme intermédiaire et ne peut être tenu responsable
                des services fournis par les prestataires.
              </p>

              <h3 className="text-xl font-semibold mb-4">6. Modifications</h3>
              <p className="mb-4">
                Nous nous réservons le droit de modifier ces conditions à tout
                moment. Les modifications seront publiées sur cette page.
              </p>

              <h3 className="text-xl font-semibold mb-4">7. Contact</h3>
              <p className="mb-4">
                Pour toute question concernant ces conditions, contactez-nous à
                support@dsg.com
              </p>
            </div>

            {/* Back to login */}
            <div className="mt-8 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: currentTheme.interactive.primary,
                  color: currentTheme.text.inverse,
                }}>
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
