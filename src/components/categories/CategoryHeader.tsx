import React from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface CategoryHeaderProps {
  name: string;
  description?: string;
  children?: React.ReactNode;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ name, description, children }) => {
  const { currentTheme } = useDarkMode();
  return (
    <header className="mb-6">
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: currentTheme.text.primary }}
      >
        {name}
      </h1>
      {description && (
        <p className="text-base mb-2" style={{ color: currentTheme.text.muted }}>
          {description}
        </p>
      )}
      {children}
    </header>
  );
};

export default CategoryHeader; 