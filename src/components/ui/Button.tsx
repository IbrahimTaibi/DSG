import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  style,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const { currentTheme } = useDarkMode();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: currentTheme.interactive.primary,
          color: currentTheme.text.inverse,
          border: `1.5px solid ${currentTheme.interactive.primary}`,
        };
      case 'secondary':
        return {
          background: currentTheme.background.secondary,
          color: currentTheme.text.primary,
          border: `1.5px solid ${currentTheme.border.primary}`,
        };
      case 'outline':
        return {
          background: 'transparent',
          color: currentTheme.text.primary,
          border: `1.5px solid ${currentTheme.border.primary}`,
        };
      default:
        return {
          background: currentTheme.interactive.primary,
          color: currentTheme.text.inverse,
          border: `1.5px solid ${currentTheme.interactive.primary}`,
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      className={`rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getSizeClasses()} ${className}`}
      style={{ ...getVariantStyles(), ...style }}
      {...props}
      onMouseOver={e => {
        if (variant === 'primary') e.currentTarget.style.background = currentTheme.interactive.primaryHover;
        if (variant === 'secondary') e.currentTarget.style.background = currentTheme.background.card;
        if (variant === 'outline') e.currentTarget.style.background = currentTheme.background.secondary;
      }}
      onMouseOut={e => {
        if (variant === 'primary') e.currentTarget.style.background = currentTheme.interactive.primary;
        if (variant === 'secondary') e.currentTarget.style.background = currentTheme.background.secondary;
        if (variant === 'outline') e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
};

export default Button;
