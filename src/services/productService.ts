import { Product } from '@/types/product';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface ProductListResult {
  total: number;
  page: number;
  pageSize: number;
  products: Product[];
}

export async function fetchProductsByCategorySlug(slug: string, page = 1, limit = 20): Promise<ProductListResult> {
  const res = await fetch(`${API_BASE}/api/products/advancedSearch?category=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductsByCategoryIdFast(categoryId: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products/category/${categoryId}/products/fast`);
  if (!res.ok) throw new Error('Failed to fetch products (fast)');
  return res.json();
}

export async function fetchAllProducts(page = 1, limit = 20): Promise<ProductListResult> {
  const res = await fetch(`${API_BASE}/api/products?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch all products');
  return res.json();
} 