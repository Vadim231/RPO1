/**
 * Конфигурация Socket.IO клиента
 * 
 * Измените BASE_URL в соответствии с вашим сервером
 */

const BASE_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

export const socketIOConfig = {
  baseUrl: BASE_URL,
  options: {
    transports: ['websocket', 'polling'] as string[],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  },
};

/**
 * Пример использования:
 * 
 * import { socketIOConfig } from './config/socketio';
 * import { createSocketIO } from '@/shared/hooks/useSocketIO';
 * 
 * const socket = createSocketIO(socketIOConfig);
 * await socket.connect({ token: 'your-jwt-token' });
 */

export default socketIOConfig;
