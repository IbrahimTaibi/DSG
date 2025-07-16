import React, { useState, useRef, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

interface DropdownOption {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  options,
  className = "",
}) => {
  const { currentTheme } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">(
    "right",
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 12rem = 192px
      const viewportWidth = window.innerWidth;

      // Check if there's enough space on the right
      const spaceOnRight = viewportWidth - triggerRect.right;
      const spaceOnLeft = triggerRect.left;

      // Position dropdown on the left if there's not enough space on the right
      // but there's enough space on the left
      if (spaceOnRight < dropdownWidth && spaceOnLeft >= dropdownWidth) {
        setDropdownPosition("left");
      } else {
        setDropdownPosition("right");
      }
    }
  }, [isOpen]);

  const handleOptionClick = (option: DropdownOption) => {
    option.onClick();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-48 rounded-xl shadow-lg border z-10 max-w-[calc(100vw-2rem)] ${
            dropdownPosition === "left" ? "right-0" : "left-0"
          }`}
          style={{
            background: currentTheme.background.card,
            borderColor: currentTheme.border.primary,
          }}>
          <div className="py-2">
            {options.map((option, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-opacity-10 transition-colors"
                style={{
                  color: currentTheme.text.primary,
                  background: currentTheme.text.primary + "05",
                }}
                onClick={() => handleOptionClick(option)}>
                {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
