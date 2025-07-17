import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchUserStats, 
  fetchStoreStats, 
  fetchDeliveryStats, 
  fetchPlatformStats,
  UserStats, 
  StoreStats, 
  DeliveryStats, 
  PlatformStats 
} from '@/services/statsService';

export const useUserStats = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    orders: 0,
    reviews: 0,
    favorites: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const userStatsData = await fetchUserStats(token);
      setStats(userStatsData);
    } catch (err: unknown) {
      // Suppress error logging for 403 forbidden
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string' && (err as { message: string }).message.includes('403')) {
        setError(null);
      } else {
        console.error('Error loading user stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refresh = () => {
    loadStats();
  };

  return { stats, loading, error, refresh };
};

export const useStoreStats = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<StoreStats>({
    activeProducts: 0,
    pendingOrders: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'store') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const storeStatsData = await fetchStoreStats(token);
      setStats(storeStatsData);
    } catch (err) {
      console.error('Error loading store stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refresh = () => {
    loadStats();
  };

  return { stats, loading, error, refresh };
};

export const useDeliveryStats = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DeliveryStats>({
    assignedOrders: 0,
    deliveredOrders: 0,
    pendingDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'delivery') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const deliveryStatsData = await fetchDeliveryStats(token);
      setStats(deliveryStatsData);
    } catch (err) {
      console.error('Error loading delivery stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refresh = () => {
    loadStats();
  };

  return { stats, loading, error, refresh };
};

export const usePlatformStats = () => {
  const [stats, setStats] = useState<PlatformStats>({
    totalProducts: 0,
    expressDelivery: '24h',
    qualityGuarantee: '100%',
    satisfiedCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const platformStats = await fetchPlatformStats();
      setStats(platformStats);
    } catch (err) {
      console.error('Error loading platform stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refresh = () => {
    loadStats();
  };

  return { stats, loading, error, refresh };
}; 