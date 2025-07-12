import { useNotifications as useNotificationsFromContext } from '../contexts/NotificationContext';

export function useNotifications() {
  return useNotificationsFromContext();
} 