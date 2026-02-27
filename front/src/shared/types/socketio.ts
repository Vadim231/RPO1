// Socket.IO типы событий

export interface SocketIOAuth {
  token: string;
}

export interface ServerToClientEvents {
  // Приветственное сообщение
  server_message: (data: {
    type: 'welcome' | string;
    message?: string;
    user_id?: number;
    username?: string;
    server_time?: string;
    online?: boolean;
    [key: string]: any;
  }) => void;

  // Новое сообщение в чате
  new_message: (data: {
    type: 'new_message';
    data: any;
    timestamp: string;
  }) => void;

  // Обновление сообщения
  message_update: (data: {
    type: 'message_update';
    data: any;
    timestamp: string;
  }) => void;

  // Удаление сообщения
  message_delete: (data: {
    type: 'message_delete';
    data: { message_id: number };
    timestamp: string;
  }) => void;

  // Пользователь набирает текст
  typing_status: (data: {
    type: 'user_typing';
    chat_id: number;
    user_id: number;
    username: string;
    is_typing: boolean;
    timestamp: string;
  }) => void;

  // Прочтение сообщения
  read_receipt: (data: {
    type: 'message_read';
    message_id: number;
    chat_id: number;
    read_by_user_id: number;
    read_by_username: string;
    timestamp: string;
  }) => void;

  // Статус пользователя
  user_status: (data: {
    type: 'user_status';
    data: {
      user_id: number;
      is_online: boolean;
      last_seen: string | null;
      timestamp: string;
    };
  }) => void;

  // Список онлайн пользователей
  online_users: (data: {
    chat_id?: number;
    online_users: number[];
    count: number;
  }) => void;

  // Подписка подтверждена
  subscribed: (data: {
    chat_id: number;
    timestamp: string;
  }) => void;

  // Отписка подтверждена
  unsubscribed: (data: {
    chat_id: number;
    timestamp: string;
  }) => void;

  // Ответ на ping
  pong: (data: {
    timestamp: string;
    server_time: string;
  }) => void;

  // Ошибка
  error: (data: {
    error: string;
  }) => void;
}

export interface ClientToServerEvents {
  message: (data: ClientMessageData) => void;
}

export interface ClientMessageData {
  type: string;
  [key: string]: any;
}

export interface SocketIOConfig {
  baseUrl: string;
  options?: {
    transports?: string[];
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    timeout?: number;
    auth?: SocketIOAuth;
  };
}
