import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = React.memo(({
  isOpen,
  onClick,
  className = '',
}) => {
  const { currentTheme } = useDarkMode();

  const buttonStyles = {
    backgroundColor: currentTheme.background.secondary,
    color: currentTheme.text.secondary,
    border: `1px solid ${currentTheme.border.primary}`,
  };

  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${className}`}
      style={buttonStyles}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="relative w-5 h-5">
        <span
          className={`absolute left-0 w-5 h-0.5 transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-2' : 'translate-y-0'
          }`}
          style={{ backgroundColor: currentTheme.text.secondary }}
        />
        <span
          className={`absolute left-0 w-5 h-0.5 transition-all duration-300 ease-in-out translate-y-2 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundColor: currentTheme.text.secondary }}
        />
        <span
          className={`absolute left-0 w-5 h-0.5 transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 translate-y-2' : 'translate-y-4'
          }`}
          style={{ backgroundColor: currentTheme.text.secondary }}
        />
      </div>
    </button>
  );
});

HamburgerMenu.displayName = 'HamburgerMenu';

export default HamburgerMenu; 