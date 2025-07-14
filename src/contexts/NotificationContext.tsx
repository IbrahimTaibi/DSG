import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface Notification {
  _id: string;
  type: string;
  data: { message?: string; [key: string]: unknown };
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, isConnected } = useSocket();
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5010'}/api/auth/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedNotifications = response.data.notifications || [];
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [isAuthenticated]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5010'}/api/auth/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5010'}/api/auth/notifications/read/all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: Notification) => {
      console.log('Received new notification:', notification);
      addNotification(notification);
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, isConnected, addNotification]);

  // Fetch notifications on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      clearNotifications();
    }
  }, [isAuthenticated, fetchNotifications, clearNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 