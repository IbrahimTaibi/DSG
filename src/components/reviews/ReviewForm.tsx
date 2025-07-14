import React, { useState } from 'react';
import { ReviewStars } from './ReviewStars';
import { useDarkMode } from '@/contexts/DarkModeContext';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface ReviewFormProps {
  onSubmit: (rating: number) => Promise<void>;
  initialRating?: number;
  loading?: boolean;
  success?: boolean;
  error?: string | null;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, initialRating = 0, loading, success, error }) => {
  const { currentTheme } = useDarkMode();
  const [rating, setRating] = useState(initialRating);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;
    await onSubmit(rating);
    setSubmitted(true);
  };

  if (loading) {
    return <div className="w-full flex justify-center"><div style={{ width: 320, height: 80, borderRadius: 16, overflow: 'hidden' }}><LoadingSkeleton /></div></div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border p-4 flex flex-col gap-3"
      style={{
        minWidth: 280,
        background: currentTheme.background.card,
        border: `1px solid ${currentTheme.border.primary}`,
      }}
    >
      <label className="text-xs font-medium mb-1" style={{ color: currentTheme.text.secondary }}>Votre note</label>
      <div className="mb-2"><ReviewStars value={rating} onChange={setRating} readOnly={loading} size={28} /></div>
      <button
        type="submit"
        className="w-full py-2 rounded-md font-semibold text-white transition disabled:opacity-60 text-sm"
        style={{
          background: currentTheme.interactive.primary,
        }}
        onMouseOver={e => (e.currentTarget.style.background = currentTheme.interactive.primaryHover)}
        onMouseOut={e => (e.currentTarget.style.background = currentTheme.interactive.primary)}
        disabled={loading || rating < 1 || rating > 5}
      >
        {loading ? 'Envoi...' : 'Envoyer mon avis'}
      </button>
      {success && submitted && <div className="text-green-600 mt-2 text-xs">Merci pour votre avis !</div>}
      {error && <div className="text-red-500 mt-2 text-xs">{error}</div>}
    </form>
  );
}; 