import { useDarkMode } from "@/contexts/DarkModeContext";
import HeroSection from "@/components/landing/HeroSection";

import StatsSection from "@/components/landing/StatsSection";
import ContactUs from "@/components/landing/ContactUs";

export default function LandingPage() {
  const { currentTheme } = useDarkMode();

  return (
    <div
      style={{
        backgroundColor: currentTheme.background.primary,
      }}>
      <HeroSection />
      <StatsSection />
    
      <ContactUs />
    </div>
  );
}
