import { API_CONFIG } from '@/config/api';
import { Review } from '@/types/review';

export interface ProductReviewsResult {
  count: number;
  average: number;
  reviews: Review[];
}

export async function fetchProductReviews(productId: string): Promise<ProductReviewsResult> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/${productId}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch product reviews');
  return res.json();
}

export async function submitReview(productId: string, rating: number, token: string): Promise<Review> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, rating }),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
} 