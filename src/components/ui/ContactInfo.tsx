import { useDarkMode } from "@/contexts/DarkModeContext";
import React from "react";

export default function ContactInfo() {
  const { currentTheme } = useDarkMode();
  const iconColor = currentTheme.interactive.primary;
  return (
    <div className="mb-10 flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center">
      <div className="flex items-center gap-3">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"
            stroke={iconColor}
            strokeWidth="1.5"
          />
          <path d="M22 4l-10 9L2 4" stroke={iconColor} strokeWidth="1.5" />
        </svg>
        <span style={{ color: currentTheme.text.primary }}>
          contact@dsg.com
        </span>
      </div>
      <div className="flex items-center gap-3">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M2 6.5A1.5 1.5 0 013.5 5h17A1.5 1.5 0 0122 6.5v11A1.5 1.5 0 0120.5 19h-17A1.5 1.5 0 012 17.5v-11z"
            stroke={iconColor}
            strokeWidth="1.5"
          />
          <path d="M6 8h12M6 12h8" stroke={iconColor} strokeWidth="1.5" />
        </svg>
        <span style={{ color: currentTheme.text.primary }}>
          +33 1 23 45 67 89
        </span>
      </div>
      <div className="flex items-center gap-3">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="10"
            r="3.5"
            stroke={iconColor}
            strokeWidth="1.5"
          />
          <path
            d="M12 13.5c-4 0-7 2-7 4.5v2h14v-2c0-2.5-3-4.5-7-4.5z"
            stroke={iconColor}
            strokeWidth="1.5"
          />
        </svg>
        <span style={{ color: currentTheme.text.primary }}>Paris, France</span>
      </div>
    </div>
  );
}
