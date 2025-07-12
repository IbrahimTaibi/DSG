import { useSocket as useSocketFromContext } from '../contexts/SocketContext';

export function useSocket() {
  return useSocketFromContext();
} 