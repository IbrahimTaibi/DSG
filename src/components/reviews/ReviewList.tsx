import React, { useState } from 'react';
import { Review } from '@/types/review';
import { ReviewStars } from './ReviewStars';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface ReviewListProps {
  reviews: Review[];
  average: number;
  count: number;
  // loading?: boolean; // Removed unused prop
}

const REVIEWS_TO_SHOW = 3;

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, average, count }) => {
  const { currentTheme } = useDarkMode();
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? reviews : reviews.slice(0, REVIEWS_TO_SHOW);
  return (
    <section
      className="w-full flex flex-col items-start"
    >
      <div className="flex items-center gap-2 mb-2">
        <ReviewStars value={average} readOnly size={18} />
        <span className="text-base font-semibold" style={{ color: currentTheme.text.primary }}>{average.toFixed(1)}</span>
        <span className="text-gray-500 text-sm">({count} avis)</span>
      </div>
      <ul className="w-full divide-y divide-gray-200 dark:divide-gray-800">
        {reviews.length === 0 ? (
          <li className="text-gray-400 text-center py-4">Aucun avis pour ce produit.</li>
        ) : (
          visibleReviews.map((review) => (
            <li key={review._id} className="py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm" style={{ color: currentTheme.text.primary }}>{review.user.name}</span>
                <ReviewStars value={review.rating} readOnly size={14} />
                <span className="text-xs text-gray-400">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
              </div>
            </li>
          ))
        )}
      </ul>
      {reviews.length > REVIEWS_TO_SHOW && !showAll && (
        <button
          className="mt-2 px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setShowAll(true)}
        >
          Afficher plus d&apos;avis
        </button>
      )}
    </section>
  );
}; 