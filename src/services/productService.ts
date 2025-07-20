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

export async function createProduct(data: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Only send the required fields to the backend
  const payload: Record<string, any> = {
    name: data.name,
    price: data.price,
    stock: data.stock,
    image: data.image,
    description: data.description,
    category: data.category,
    additionalCategories: data.additionalCategories || [],
  };
  if (data.tax) payload.tax = typeof data.tax === 'string' ? data.tax : data.tax.id;
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/products`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) {
    let errorMsg = "Failed to create product";
    try {
      const errData = await res.json();
      if (errData && errData.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function deleteProduct(id: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = 'Failed to delete product';
    try {
      const errData = await res.json();
      if (errData && errData.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function updateProduct(id: string, data: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Only send the required fields to the backend
  const payload: Record<string, any> = {
    name: data.name,
    price: data.price,
    stock: data.stock,
    image: data.image,
    description: data.description,
    category: data.category,
    // Do not send additionalCategories
    status: data.status,
  };
  if (data.tax) payload.tax = typeof data.tax === 'string' ? data.tax : data.tax.id;
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = 'Failed to update product';
    try {
      const errData = await res.json();
      if (errData && errData.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function updateProductStatus(id: string, status: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/${id}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status }),
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = 'Failed to update product status';
    try {
      const errData = await res.json();
      if (errData && errData.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
} 