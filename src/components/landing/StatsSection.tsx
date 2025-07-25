import { useDarkMode } from "@/contexts/DarkModeContext";
import { usePlatformStats } from "@/hooks/useStats";

export default function StatsSection() {
  const { currentTheme } = useDarkMode();
  const { stats, loading } = usePlatformStats();

  if (loading) {
    return (
      <section
        className="py-16 relative"
        style={{ backgroundColor: `${currentTheme.interactive.primary}05` }}>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-3xl font-bold mb-2 animate-pulse bg-gray-300 dark:bg-gray-600 h-8 rounded"
                  style={{ color: currentTheme.interactive.primary }}>
                </div>
                <div
                  className="text-sm font-medium animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded"
                  style={{ color: currentTheme.text.muted }}>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 relative"
      style={{ backgroundColor: `${currentTheme.interactive.primary}05` }}>
      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${currentTheme.interactive.primary} 1px, transparent 1px), linear-gradient(90deg, ${currentTheme.interactive.primary} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}></div>
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div
              className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
              style={{ color: currentTheme.interactive.primary }}>
              {stats.totalProducts}+
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: currentTheme.text.muted }}>
              Produits disponibles
            </div>
          </div>
          <div className="text-center group">
            <div
              className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
              style={{ color: currentTheme.interactive.secondary }}>
              {stats.expressDelivery}
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: currentTheme.text.muted }}>
              Livraison express
            </div>
          </div>
          <div className="text-center group">
            <div
              className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
              style={{ color: currentTheme.interactive.accent }}>
              {stats.qualityGuarantee}
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: currentTheme.text.muted }}>
              Qualité garantie
            </div>
          </div>
          <div className="text-center group">
            <div
              className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
              style={{ color: currentTheme.interactive.primary }}>
              {stats.satisfiedCustomers}+
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: currentTheme.text.muted }}>
              Clients satisfaits
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
