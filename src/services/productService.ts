import { Product } from '@/types/product';
import { API_CONFIG } from '@/config/api';

export interface ProductListResult {
  total: number;
  page: number;
  pageSize: number;
  products: Product[];
}

export async function fetchProductsByCategorySlug(slug: string, page = 1, limit = 20): Promise<ProductListResult> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/search?category=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductsByCategoryIdFast(categoryId: string): Promise<Product[]> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/search?category=${categoryId}&limit=100`);
  if (!res.ok) throw new Error('Failed to fetch products (fast)');
  const result = await res.json();
  return result.products || [];
}

export async function fetchAllProducts(page = 1, limit = 20): Promise<ProductListResult> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/search?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch all products');
  return res.json();
} 