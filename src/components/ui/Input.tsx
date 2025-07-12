import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  inputClassName?: string;
  style?: React.CSSProperties;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      containerClassName = "",
      labelClassName = "",
      labelStyle,
      inputClassName = "",
      style,
      ...props
    },
    ref,
  ) => {
    const { currentTheme } = useDarkMode();

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-sm font-medium mb-2 ${labelClassName}`}
            style={{
              color: currentTheme.text.primary,
              ...labelStyle
            }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${inputClassName}`}
          style={{
            backgroundColor: currentTheme.background.secondary,
            color: currentTheme.text.primary,
            border: error
              ? `1.5px solid ${currentTheme.status.error}`
              : `1px solid ${currentTheme.border.primary}`,
            boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
            ...style
          }}
          {...props}
        />
        {error && (
          <div
            className="mt-1 text-xs"
            style={{ color: currentTheme.status.error }}>
            {error}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;
