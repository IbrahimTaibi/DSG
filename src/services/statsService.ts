import { API_CONFIG } from '@/config/api';

export interface UserStats {
  orders: number;
  reviews: number;
  favorites: number;
  totalSpent: number;
}

export interface StoreStats {
  activeProducts: number;
  pendingOrders: number;
  averageRating: number;
}

export interface DeliveryStats {
  assignedOrders: number;
  deliveredOrders: number;
  pendingDeliveries: number;
}

export interface PlatformStats {
  totalProducts: number;
  expressDelivery: string;
  qualityGuarantee: string;
  satisfiedCustomers: number;
}

// Fetch user statistics
export const fetchUserStats = async (token: string): Promise<UserStats> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        // Forbidden: return default stats, no error
        return {
          orders: 0,
          reviews: 0,
          favorites: 0,
          totalSpent: 0,
        };
      }
      throw new Error('Failed to fetch user stats');
    }

    const orders = await response.json();
    
    // Calculate stats from orders
    const totalSpent = orders.reduce((sum: number, order: Record<string, unknown>) => sum + (typeof order.total === 'number' ? order.total : 0), 0);
    const ordersCount = orders.length;
    
    // For now, we'll use placeholder values for reviews and favorites
    // These would need separate endpoints in the backend
    return {
      orders: ordersCount,
      reviews: 0, // TODO: Add reviews endpoint
      favorites: 0, // TODO: Add favorites endpoint
      totalSpent,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      orders: 0,
      reviews: 0,
      favorites: 0,
      totalSpent: 0,
    };
  }
};

// Fetch store statistics
export const fetchStoreStats = async (token: string): Promise<StoreStats> => {
  try {
    // Fetch products for the store - use the getAll endpoint which returns an array
    const productsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!productsResponse.ok) {
      throw new Error('Failed to fetch store products');
    }

    let products = await productsResponse.json();
    
    // Ensure products is an array
    if (!Array.isArray(products)) {
      console.error('Products response is not an array:', products);
      return {
        activeProducts: 0,
        pendingOrders: 0,
        averageRating: 4.8,
      };
    }
    // Map _id to id for consistency
    products = products.map((product: any) => ({ ...product, id: product._id || product.id }));
    const activeProducts = products.filter((product: Record<string, unknown>) => product.status === 'active').length;

    // Fetch orders for the store
    const ordersResponse = await fetch(`${API_CONFIG.BASE_URL}/api/orders/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!ordersResponse.ok) {
      throw new Error('Failed to fetch store orders');
    }

    const orders = await ordersResponse.json();
    
    // Ensure orders is an array
    if (!Array.isArray(orders)) {
      console.error('Orders response is not an array:', orders);
      return {
        activeProducts,
        pendingOrders: 0,
        averageRating: 4.8,
      };
    }
    
    const pendingOrders = orders.filter((order: Record<string, unknown>) => 
      order.status === 'pending' || order.status === 'waiting_for_delivery'
    ).length;

    return {
      activeProducts,
      pendingOrders,
      averageRating: 4.8, // TODO: Add rating calculation from reviews
    };
  } catch (error) {
    console.error('Error fetching store stats:', error);
    return {
      activeProducts: 0,
      pendingOrders: 0,
      averageRating: 0,
    };
  }
};

// Fetch delivery statistics
export const fetchDeliveryStats = async (token: string): Promise<DeliveryStats> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/assigned`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch delivery stats');
    }

    const orders = await response.json();
    
    // Ensure orders is an array
    if (!Array.isArray(orders)) {
      console.error('Orders response is not an array:', orders);
      return {
        assignedOrders: 0,
        deliveredOrders: 0,
        pendingDeliveries: 0,
      };
    }
    
    const assignedOrders = orders.length;
    const deliveredOrders = orders.filter((order: Record<string, unknown>) => order.status === 'delivered').length;
    const pendingDeliveries = orders.filter((order: Record<string, unknown>) => 
      order.status === 'delivering' || order.status === 'waiting_for_delivery'
    ).length;

    return {
      assignedOrders,
      deliveredOrders,
      pendingDeliveries,
    };
  } catch (error) {
    console.error('Error fetching delivery stats:', error);
    return {
      assignedOrders: 0,
      deliveredOrders: 0,
      pendingDeliveries: 0,
    };
  }
};

// Fetch platform statistics (for landing page)
export const fetchPlatformStats = async (): Promise<PlatformStats> => {
  try {
    // Fetch total products - use the getAll endpoint which returns an array
    const productsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/products`);
    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products');
    }
    let products = await productsResponse.json();
    // Ensure products is an array
    if (!Array.isArray(products)) {
      console.error('Products response is not an array:', products);
      return {
        totalProducts: 0,
        expressDelivery: '24h',
        qualityGuarantee: '100%',
        satisfiedCustomers: 0,
      };
    }
    // Map _id to id for consistency
    products = products.map((product: any) => ({ ...product, id: product._id || product.id }));
    const totalProducts = products.length;

    // For now, we'll use some reasonable defaults for platform stats
    // These could be calculated from actual data in the future
    return {
      totalProducts,
      expressDelivery: '24h',
      qualityGuarantee: '100%',
      satisfiedCustomers: Math.floor(totalProducts * 0.8), // Estimate based on products
    };
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return {
      totalProducts: 0,
      expressDelivery: '24h',
      qualityGuarantee: '100%',
      satisfiedCustomers: 0,
    };
  }
}; 