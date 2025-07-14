export interface Review {
  _id?: string;
  user: { _id: string; name: string };
  product: string;
  rating: number;
  createdAt?: string;
} 