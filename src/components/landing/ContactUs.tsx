import { useDarkMode } from "@/contexts/DarkModeContext";

export default function ContactUs() {
  const { currentTheme } = useDarkMode();
  return (
    <section
      className="py-24 relative"
      style={{ backgroundColor: `${currentTheme.interactive.accent}05` }}>
      {/* Animated background elements */}
      <div
        className="absolute top-10 left-1/4 w-20 h-20 rounded-full opacity-10 animate-pulse"
        style={{ backgroundColor: currentTheme.interactive.primary }}></div>
      <div
        className="absolute bottom-10 right-1/4 w-16 h-16 rounded-full opacity-10 animate-pulse"
        style={{
          backgroundColor: currentTheme.interactive.secondary,
          animationDelay: "2s",
        }}></div>

      <div className="max-w-6xl mx-auto px-4">
        <div
          className="rounded-3xl p-16 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.interactive.primary}05, ${currentTheme.interactive.secondary}05)`,
            border: `2px solid ${currentTheme.border.primary}`,
          }}>
          <div className="relative z-10">
            <h2
              className="text-5xl font-bold mb-6"
              style={{ color: currentTheme.text.primary }}>
              Prêt à commencer ?
            </h2>
            <p
              className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
              style={{ color: currentTheme.text.secondary }}>
              Contactez-nous pour un devis personnalisé et découvrez nos offres
              spéciales pour votre entreprise
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                className="px-10 py-5 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:rotate-1"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.interactive.primary}, ${currentTheme.interactive.secondary})`,
                  boxShadow: `0 15px 40px ${currentTheme.interactive.primary}40`,
                }}>
                Demander un devis
              </button>
              <button
                className="px-10 py-5 rounded-2xl font-bold border-2 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-rotate-1"
                style={{
                  backgroundColor: currentTheme.background.card,
                  color: currentTheme.interactive.primary,
                  borderColor: currentTheme.interactive.primary,
                }}>
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
