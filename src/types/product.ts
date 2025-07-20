export interface Product {
  id: string;
  _id?: string;
  name: string;
  price?: number;
  pricePerBox?: number;
  image?: string;
  category?: { name: string } | string;
  additionalCategories?: string[];
  description?: string;
  stock?: number;
  averageRating?: number;
  reviewCount?: number;
  status?: "active" | "inactive" | "out_of_stock" | "discontinued" | "draft";
  rating?: number;
  createdAt?: string;
  tax?: string | import("@/services/taxService").Tax;
  // Add more fields as needed for your app
} 