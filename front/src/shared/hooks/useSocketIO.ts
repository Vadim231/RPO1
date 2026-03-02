import { io, Socket } from 'socket.io-client';
import {
  SocketIOConfig,
  SocketIOAuth,
  ServerToClientEvents,
  ClientToServerEvents,
  ClientMessageData,
} from '../types/socketio';

class SocketIOClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private config: SocketIOConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(config: SocketIOConfig) {
    this.config = config;
  }

  /**
   * Подключение к Socket.IO серверу
   */
  connect(auth?: SocketIOAuth): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      const options = {
        transports: this.config.options?.transports || ['websocket', 'polling'],
        reconnection: this.config.options?.reconnection ?? true,
        reconnectionAttempts:
          this.config.options?.reconnectionAttempts ??
          this.maxReconnectAttempts,
        reconnectionDelay: this.config.options?.reconnectionDelay ?? 1000,
        timeout: this.config.options?.timeout ?? 20000,
        auth: auth || this.config.options?.auth,
        withCredentials: true,
      };

      this.socket = io(this.config.baseUrl, options);

      this.socket.on('connect', () => {
        console.log('[Socket.IO] Connected:', this.socket?.id);
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('[Socket.IO] Connection error:', error);
        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Превышено количество попыток подключения'));
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[Socket.IO] Disconnected:', reason);
      });

      this.socket.on('error', (error) => {
        console.error('[Socket.IO] Error:', error);
      });
    });
  }

  /**
   * Отключение от сервера
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Проверка подключения
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Отправка сообщения на сервер
   */
  sendMessage(data: ClientMessageData): void {
    if (!this.socket?.connected) {
      console.warn('[Socket.IO] Not connected, message not sent:', data);
      return;
    }
    this.socket.emit('message', data);
  }

  /**
   * Подписка на чат
   */
  subscribeToChat(chatId: number): void {
    this.sendMessage({ type: 'subscribe', chat_id: chatId });
  }

  /**
   * Отписка от чата
   */
  unsubscribeFromChat(chatId: number): void {
    this.sendMessage({ type: 'unsubscribe', chat_id: chatId });
  }

  /**
   * Индикация набора текста
   */
  sendTypingStatus(chatId: number, isTyping: boolean): void {
    this.sendMessage({ type: 'typing', chat_id: chatId, is_typing: isTyping });
  }

  /**
   * Подтверждение прочтения сообщения
   */
  sendReadReceipt(messageId: number, chatId: number): void {
    this.sendMessage({
      type: 'read_receipt',
      message_id: messageId,
      chat_id: chatId,
    });
  }

  /**
   * Ping сервера
   */
  sendPing(): void {
    this.sendMessage({ type: 'ping' });
  }

  /**
   * Запрос списка онлайн пользователей
   */
  getOnlineUsers(chatId?: number): void {
    this.sendMessage({ type: 'get_online_users', chat_id: chatId });
  }

  /**
   * Подписка на событие
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      (this.socket as any).on(event, callback);
    }
  }

  /**
   * Отписка от события
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      (this.socket as any).off(event, callback);
    }
  }

  /**
   * Одноразовая подписка на событие
   */
  once(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      (this.socket as any).once(event, callback);
    }
  }

  /**
   * Получение ID сокета
   */
  getId(): string | undefined {
    return this.socket?.id;
  }
}

// Экспорт единственного экземпляра
let socketIOInstance: SocketIOClient | null = null;

export function getSocketIO(config?: SocketIOConfig): SocketIOClient {
  if (!socketIOInstance) {
    if (!config) {
      throw new Error('Socket.IO config is required for first initialization');
    }
    socketIOInstance = new SocketIOClient(config);
  }
  return socketIOInstance;
}

export function createSocketIO(config: SocketIOConfig): SocketIOClient {
  socketIOInstance = new SocketIOClient(config);
  return socketIOInstance;
}

export default SocketIOClient;
export { SocketIOClient };
