// Theme type definitions
export type ColorShade =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export type ColorPalette = {
  [key in ColorShade]: string;
};

export type ColorScheme = {
  primary: ColorPalette;
  secondary: ColorPalette;
  accent: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  neutral: ColorPalette;
};

export type ThemeBackground = {
  primary: string;
  secondary: string;
  tertiary: string;
  card: string;
  overlay: string;
};

export type ThemeText = {
  primary: string;
  secondary: string;
  tertiary: string;
  inverse: string;
  muted: string;
};

export type ThemeBorder = {
  primary: string;
  secondary: string;
  accent: string;
};

export type ThemeInteractive = {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
};

export type ThemeStatus = {
  success: string;
  warning: string;
  error: string;
  info: string;
};

export type Theme = {
  background: ThemeBackground;
  text: ThemeText;
  border: ThemeBorder;
  interactive: ThemeInteractive;
  status: ThemeStatus;
};

export type ThemeMode = "light" | "dark";

// Component-specific theme types
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export type InputVariant = "default" | "filled" | "outlined";
export type InputSize = "sm" | "md" | "lg";

export type CardVariant = "default" | "elevated" | "outlined";

// Spacing and sizing types
export type SpacingScale =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64;

export type BorderRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export type FontSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";

export type FontWeight =
  | "thin"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

// Animation and transition types
export type TransitionDuration = "fast" | "normal" | "slow";
export type TransitionEasing =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

export type AnimationType = "fade" | "slide" | "scale" | "rotate" | "bounce";
