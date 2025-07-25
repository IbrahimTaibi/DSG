import React, { useState } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  inputClassName?: string;
  style?: React.CSSProperties;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
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
    const [show, setShow] = useState(false);
    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-sm font-medium mb-2 ${labelClassName}`}
            style={labelStyle}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={show ? "text" : "password"}
            className={`w-full px-4 py-3 pr-12 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${inputClassName}`}
            style={style}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors"
            style={{
              color: currentTheme.text.muted,
              backgroundColor: `${currentTheme.text.muted}20`,
            }}>
            {show ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
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
PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
