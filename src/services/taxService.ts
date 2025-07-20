import { API_CONFIG } from '@/config/api';

export interface Tax {
  id: string;
  name: string;
  rate: number;
  code: string;
  description?: string;
  active?: boolean;
  type?: string;
}

function getAuthHeaders(contentType = true) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function mapTax(tax: any): Tax {
  return {
    ...tax,
    id: tax.id || tax._id,
  };
}

export async function fetchTaxes(): Promise<Tax[]> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/taxes`, {
    headers: getAuthHeaders(false),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch taxes');
  const data = await res.json();
  return data.map(mapTax);
}

export async function createTax(data: Partial<Tax>): Promise<Tax> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/taxes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = 'Failed to create tax';
    try {
      const errData = await res.json();
      if (errData && errData.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  const tax = await res.json();
  return mapTax(tax);
}

export async function updateTax(id: string, data: Partial<Tax>): Promise<Tax> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/taxes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = 'Failed to update tax';
    try {
      const errData = await res.json();
      if (errData && errData.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  const tax = await res.json();
  return mapTax(tax);
}

export async function deleteTax(id: string): Promise<void> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/taxes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = 'Failed to delete tax';
    try {
      const errData = await res.json();
      if (errData && errData.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
} 