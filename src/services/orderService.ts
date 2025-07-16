const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010";

// Helper to get auth headers
function getAuthHeaders(contentType = true) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/api/orders`, {
    headers: getAuthHeaders(false),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return await res.json();
}

export async function fetchOrderById(id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    headers: getAuthHeaders(false),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch order");
  return await res.json();
}

export async function updateOrder(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update order");
  return await res.json();
}

export async function deleteOrder(id: string) {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(false),
    credentials: "include",
  });
  if (!res.ok) {
    let errorMsg = "Failed to delete order";
    try {
      const data = await res.json();
      if (data && data.message) errorMsg = data.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return await res.json();
}

export async function createOrder(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    let errorMsg = "Failed to create order";
    try {
      const errData = await res.json();
      if (errData && errData.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return await res.json();
} 