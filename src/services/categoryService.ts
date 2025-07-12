import { Category } from '@/types/admin';
import { API_CONFIG } from '@/config/api';

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/categories`);
    if (!res.ok) return null;
    
    const categories = await res.json();
    return categories.find((cat: Category) => cat.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

export async function fetchCategoryBySlugPath(slugPath: string[]): Promise<Category | null> {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/categories`);
    if (!res.ok) return null;
    
    const categories = await res.json();
    const path = slugPath.join('/');
    return categories.find((cat: Category) => cat.slug === path) || null;
  } catch (error) {
    console.error('Error fetching category by slug path:', error);
    return null;
  }
}

export async function fetchCategoryTree(): Promise<Category[]> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/categories/tree`);
  if (!res.ok) throw new Error('Failed to fetch category tree');
  return res.json();
} 