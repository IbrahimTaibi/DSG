import { useState, useCallback } from 'react';
import { fetchProductReviews, submitReview, ProductReviewsResult } from '@/services/reviewService';
import { Review } from '@/types/review';

export function useProductReviews(productId: string) {
  const [data, setData] = useState<ProductReviewsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProductReviews(productId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  return { ...data, loading, error, reload: load };
}

export function useSubmitReview(productId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (rating: number, token: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await submitReview(productId, rating, token);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  return { submit, loading, error, success };
} 