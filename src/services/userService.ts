const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010";

// Helper to get auth headers
function getAuthHeaders(contentType = true) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/api/users`, {
    headers: getAuthHeaders(false),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
}

export async function fetchUserById(id: string) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    headers: getAuthHeaders(false),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
}

export async function updateUser(id: string, data: { name?: string; email?: string; role?: string; address?: string; status?: string }) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update user");
  return await res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(false),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return await res.json();
}

export async function fetchUsersWithOrderCount() {
  const res = await fetch(`${API_BASE}/api/users/with-order-count`, {
    headers: getAuthHeaders(false),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users with order count");
  return await res.json();
} 