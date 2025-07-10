import { Category } from '@/types/admin';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const res = await fetch(`${API_BASE}/api/categories/slug/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCategoryBySlugPath(slugPath: string[]): Promise<Category | null> {
  const path = slugPath.join('/');
  const res = await fetch(`${API_BASE}/api/categories/path/${path}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCategoryTree(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/api/categories/tree`);
  if (!res.ok) throw new Error('Failed to fetch category tree');
  return res.json();
} 