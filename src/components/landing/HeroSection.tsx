import { useDarkMode } from "@/contexts/DarkModeContext";

export default function HeroSection() {
  const { currentTheme } = useDarkMode();
  return (
    <section
      className={`relative overflow-hidden animated-hero-bg${
        currentTheme.background.primary === "#0f172a" ? "-dark" : ""
      }`}>
      <style jsx global>{`
        .animated-hero-bg {
          background: linear-gradient(120deg, #e6efed, #cce0db, #e1f3f1, #c3e7e3);
          background-size: 400% 400%;
          animation: heroGradientMove 12s ease-in-out infinite;
        }
        .animated-hero-bg-dark {
          background: linear-gradient(120deg, #15222e, #1a2b3a, #27445d, #111c25);
          background-size: 400% 400%;
          animation: heroGradientMove 12s ease-in-out infinite;
        }
        @keyframes heroGradientMove {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {/* Decorative background elements */}
      <div
        className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10"
        style={{ backgroundColor: currentTheme.interactive.primary }}></div>
      <div
        className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: currentTheme.interactive.secondary }}></div>
      <div
        className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-5"
        style={{ backgroundColor: currentTheme.interactive.accent }}></div>
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center px-4 py-2 rounded-full mb-6 text-sm font-medium animate-pulse"
              style={{
                backgroundColor: `${currentTheme.interactive.primary}20`,
                color: currentTheme.interactive.primary,
              }}>
              <span
                className="w-2 h-2 rounded-full mr-2 animate-ping"
                style={{
                  backgroundColor: currentTheme.interactive.primary,
                }}></span>
              Fournisseur de confiance
            </div>
            <h1
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ color: currentTheme.text.primary }}>
              Épicerie en{" "}
              <span style={{ color: currentTheme.interactive.primary }}>
                Gros
              </span>{" "}
              de Qualité
            </h1>
            <p
              className="text-xl mb-8 leading-relaxed"
              style={{ color: currentTheme.text.secondary }}>
              Approvisionnez votre entreprise avec des produits frais et de
              qualité. Prix compétitifs, livraison rapide, service
              professionnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.interactive.primary}, ${currentTheme.interactive.secondary})`,
                  boxShadow: `0 10px 30px ${currentTheme.interactive.primary}30`,
                }}>
                Commencer maintenant
              </button>
              <button
                className="px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: currentTheme.background.card,
                  color: currentTheme.interactive.primary,
                  borderColor: currentTheme.interactive.primary,
                }}>
                Voir le catalogue
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
