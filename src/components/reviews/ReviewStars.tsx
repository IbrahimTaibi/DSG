import React from 'react';
import { Star } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface ReviewStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export const ReviewStars: React.FC<ReviewStarsProps> = ({ value, onChange, size = 24, readOnly }) => {
  const { currentTheme } = useDarkMode();
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          style={{ background: 'none', border: 'none', padding: 0, cursor: readOnly ? 'default' : 'pointer' }}
          onClick={() => !readOnly && onChange?.(star)}
          tabIndex={readOnly ? -1 : 0}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          disabled={readOnly}
        >
          <Star
            size={size}
            className={
              star <= value
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }
            style={{
              fill: star <= value ? currentTheme.rating.filled : currentTheme.rating.empty,
              stroke: star <= value ? currentTheme.rating.filled : currentTheme.rating.empty,
            }}
          />
        </button>
      ))}
    </div>
  );
}; 