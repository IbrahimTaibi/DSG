const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010";

// Helper to get auth headers
function getAuthHeaders(contentType = true) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  role: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
}

export async function fetchUsers(): Promise<User[]> {
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

export async function fetchDeliveryAgents(): Promise<DeliveryAgent[]> {
  const res = await fetch(`${API_BASE}/api/users/delivery`, {
    headers: getAuthHeaders(false),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch delivery agents");
  const agents = await res.json();
  // Always map _id to id, fallback to agent.id if _id is missing
  return agents.map((agent: { _id?: string; id?: string; name: string; email?: string }) => ({
    id: agent._id || agent.id || "",
    name: agent.name,
    email: agent.email,
    // ...add other fields if needed
  }));
}

export async function assignDeliveryAgent(orderId: string, deliveryGuyId: string) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/assign`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ deliveryGuyId }),
  });
  if (!res.ok) throw new Error("Failed to assign delivery agent");
  return await res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return await res.json();
} 