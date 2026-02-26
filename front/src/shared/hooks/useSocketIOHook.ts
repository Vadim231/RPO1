import { useEffect, useState, useCallback, useRef } from 'react';
import SocketIOClient, { getSocketIO } from './useSocketIO';
import { SocketIOConfig, SocketIOAuth } from '../types/socketio';

interface UseSocketIOReturn {
  socket: SocketIOClient | null;
  isConnected: boolean;
  connect: (auth?: SocketIOAuth) => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

/**
 * React хук для работы с Socket.IO
 * 
 * @example
 * ```tsx
 * const { socket, isConnected, connect, disconnect } = useSocketIO({
 *   baseUrl: 'http://localhost:8000'
 * });
 * 
 * useEffect(() => {
 *   if (isConnected) {
 *     connect({ token: jwtToken });
 *   }
 * }, [isConnected]);
 * ```
 */
export function useSocketIO(config: SocketIOConfig): UseSocketIOReturn {
  const [socket, setSocket] = useState<SocketIOClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configRef = useRef(config);

  // Обновляем config при изменении
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Инициализация сокета
  useEffect(() => {
    const socketInstance = getSocketIO(config);
    setSocket(socketInstance);

    // Подписываемся на события подключения
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    (socketInstance as any).on('connect', handleConnect);
    (socketInstance as any).on('disconnect', handleDisconnect);

    // Проверяем текущее состояние
    setIsConnected(socketInstance.isConnected());

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
    };
  }, [config.baseUrl]);

  // Функция подключения
  const connect = useCallback(async (auth?: SocketIOAuth) => {
    try {
      setError(null);
      await socket?.connect(auth);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка подключения';
      setError(errorMessage);
      throw err;
    }
  }, [socket]);

  // Функция отключения
  const disconnect = useCallback(() => {
    socket?.disconnect();
    setIsConnected(false);
  }, [socket]);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    error,
  };
}

export default useSocketIO;
