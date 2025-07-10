import { useDarkMode } from "@/contexts/DarkModeContext";
import React from "react";

export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { currentTheme } = useDarkMode();
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <h1
        className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
        style={{ color: currentTheme.text.primary }}>
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-lg font-medium"
          style={{ color: currentTheme.text.secondary }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
