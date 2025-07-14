import React, { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface ProductDescriptionCardProps {
  description?: string;
}

export const ProductDescriptionCard: React.FC<ProductDescriptionCardProps> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const { currentTheme } = useDarkMode();
  if (!description) return null;
  return (
    <div>
      <h2 className="text-base font-semibold mb-1" style={{ color: currentTheme.text.primary }}>Description</h2>
      <div className={expanded ? 'text-sm text-gray-600 dark:text-gray-300' : 'line-clamp-3 text-sm text-gray-600 dark:text-gray-300'}>
        {description}
      </div>
      {description.length > 120 && (
        <button
          className="mt-1 text-xs text-purple-600 dark:text-purple-300 hover:underline focus:outline-none"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default ProductDescriptionCard; 