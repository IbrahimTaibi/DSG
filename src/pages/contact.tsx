import { useDarkMode } from "@/contexts/DarkModeContext";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactInfo from "@/components/ui/ContactInfo";
import ContactForm from "@/components/forms/ContactForm";
import React from "react";

export default function ContactPage() {
  const { currentTheme } = useDarkMode();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-2 py-10"
      style={{ background: currentTheme.background.primary }}>
      <div className="w-full max-w-2xl mx-auto">
        <SectionHeader
          title="Contactez-nous"
          subtitle="Une question, une suggestion, un problème ? Écrivez-nous !"
        />
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  );
}
