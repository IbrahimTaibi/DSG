export interface Product {
  id: string;
  _id?: string;
  name: string;
  price?: number;
  image?: string;
  category?: { name: string };
  // Add more fields as needed for your app
} 