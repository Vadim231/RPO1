import { useEffect, useCallback, useRef } from 'react';
import { useSocketIO } from '../../shared/hooks/useSocketIOHook';
import { socketIOConfig } from '../../shared/config/socketio';

interface UseChatSocketOptions {
  chatId: number | null;
  token: string | null;
  onNewMessage?: (data: any) => void;
  onTyping?: (data: any) => void;
  onReadReceipt?: (data: any) => void;
  onUserStatus?: (data: any) => void;
  onUserOnline?: (data: any) => void;
}

/**
 * Хук для работы с Socket.IO в чате
 * 
 * @example
 * ```tsx
 * useChatSocket({
 *   chatId: selectedChatId,
 *   userId: currentUser.id,
 *   token: authToken,
 *   onNewMessage: (data) => {
 *     setMessages(prev => [...prev, data.data]);
 *   },
 *   onTyping: (data) => {
 *     setTypingUsers(prev => [...prev, data.username]);
 *   },
 * });
 * ```
 */
export function useChatSocket({
  chatId,
  token,
  onNewMessage,
  onTyping,
  onReadReceipt,
  onUserStatus,
  onUserOnline,
}: UseChatSocketOptions) {
  const { socket, isConnected, connect, disconnect } = useSocketIO(socketIOConfig);
  const chatIdRef = useRef(chatId);

  // Обновляем chatId при изменении
  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  // Подключение при монтировании
  useEffect(() => {
    if (token && !isConnected) {
      connect({ token })
        .catch(console.error);
    }

    return () => {
      disconnect();
    };
  }, [token]);

  // Подписка на события
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Подписка на новый чат при изменении chatId
    if (chatId) {
      socket.subscribeToChat(chatId);
    }

    // Обработчики событий
    if (onNewMessage) {
      socket.on('new_message', onNewMessage);
    }

    if (onTyping) {
      socket.on('typing_status', onTyping);
    }

    if (onReadReceipt) {
      socket.on('read_receipt', onReadReceipt);
    }

    if (onUserStatus) {
      socket.on('user_status', onUserStatus);
    }

    if (onUserOnline) {
      socket.on('online_users', onUserOnline);
    }

    // Обработчик ошибок
    const handleError = (data: { error: string }) => {
      console.error('[Socket.IO] Error:', data.error);
    };
    socket.on('error', handleError);

    return () => {
      if (onNewMessage) socket.off('new_message', onNewMessage);
      if (onTyping) socket.off('typing_status', onTyping);
      if (onReadReceipt) socket.off('read_receipt', onReadReceipt);
      if (onUserStatus) socket.off('user_status', onUserStatus);
      if (onUserOnline) socket.off('online_users', onUserOnline);
      socket.off('error', handleError);

      // Отписка от чата при размонтировании или изменении chatId
      if (chatIdRef.current) {
        socket.unsubscribeFromChat(chatIdRef.current);
      }
    };
  }, [socket, isConnected, chatId, onNewMessage, onTyping, onReadReceipt, onUserStatus, onUserOnline]);

  // Функции для отправки событий
  const sendTyping = useCallback((isTyping: boolean) => {
    if (chatId && socket) {
      socket.sendTypingStatus(chatId, isTyping);
    }
  }, [chatId, socket]);

  const markAsRead = useCallback((messageId: number) => {
    if (chatId && socket) {
      socket.sendReadReceipt(messageId, chatId);
    }
  }, [chatId, socket]);

  const getOnlineUsers = useCallback(() => {
    if (socket) {
      socket.getOnlineUsers(chatId || undefined);
    }
  }, [socket, chatId]);

  return {
    socket,
    isConnected,
    sendTyping,
    markAsRead,
    getOnlineUsers,
  };
}

export default useChatSocket;
