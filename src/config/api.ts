// API Configuration
export const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010",

  // Cloudinary Configuration
  CLOUDINARY: {
    CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dwbnxhdys",
    UPLOAD_PRESET:
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "products",
    UPLOAD_URL:
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL ||
      "https://api.cloudinary.com/v1_1/dwbnxhdys/image/upload",
  },

  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
      ME: "/api/auth/me",
      FORGOT_PASSWORD: "/api/auth/forgot-password",
      RESET_PASSWORD: "/api/auth/reset-password",
      NOTIFICATIONS: "/api/auth/notifications",
      READ_ALL_NOTIFICATIONS: "/api/auth/notifications/read/all",
    },

    // Product endpoints
    PRODUCTS: {
      LIST: "/api/products",
      CREATE: "/api/products",
      UPDATE: (id: string) => `/api/products/${id}`,
      DELETE: (id: string) => `/api/products/${id}`,
      GET: (id: string) => `/api/products/${id}`,
    },

    // Category endpoints
    CATEGORIES: {
      LIST: "/api/categories",
      TREE: "/api/categories/tree",
      CREATE: "/api/categories",
      UPDATE: (id: string) => `/api/categories/${id}`,
      DELETE: (id: string) => `/api/categories/${id}`,
      GET: (id: string) => `/api/categories/${id}`,
    },
  },
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
