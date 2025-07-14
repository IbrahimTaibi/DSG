export interface Product {
  id: string;
  _id?: string;
  name: string;
  price?: number;
  image?: string;
  category?: { name: string };
  description?: string;
  stock?: number;
  averageRating?: number;
  reviewCount?: number;
  // Add more fields as needed for your app
} 