import { Category } from '@/types/admin';
import { API_CONFIG } from '@/config/api';

// Helper to get auth headers
function getAuthHeaders(contentType = true) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

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

export async function createCategory(data: { name: string; parent?: string }): Promise<Category> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function updateCategory(id: string, data: { name?: string; parent?: string }): Promise<Category> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(false),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete category');
} 