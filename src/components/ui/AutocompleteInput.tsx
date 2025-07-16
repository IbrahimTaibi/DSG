import React, { useState, useRef, useEffect } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface Option {
  label: string;
  value: string;
}

interface AutocompleteInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  style,
}) => {
  const { currentTheme } = useDarkMode();
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(options.find((opt) => opt.value === value)?.label || "");
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  };

  const handleOptionSelect = (opt: Option) => {
    setInputValue(opt.label);
    onChange(opt.value);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleOptionSelect(filteredOptions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div style={{ position: "relative", ...style }}>
      {label && (
        <label style={{ color: currentTheme.text.primary, fontWeight: 600 }}>{label}</label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full mt-1 p-2 rounded border"
        style={{
          background: currentTheme.background.secondary,
          color: currentTheme.text.primary,
          borderColor: currentTheme.border.primary,
        }}
        autoComplete="off"
      />
      {showDropdown && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 rounded border shadow-lg"
          style={{
            background: currentTheme.background.card,
            borderColor: currentTheme.border.primary,
            color: currentTheme.text.primary,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {filteredOptions.map((opt, idx) => (
            <div
              key={opt.value}
              className="px-3 py-2 cursor-pointer"
              style={{
                background:
                  idx === highlightedIndex
                    ? currentTheme.background.secondary
                    : undefined,
                color: currentTheme.text.primary,
                fontWeight: idx === highlightedIndex ? 600 : 400,
              }}
              onMouseDown={() => handleOptionSelect(opt)}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput; 