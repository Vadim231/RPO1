import { createContext, useContext, ReactNode } from 'react';
import { SocketIOClient } from '../hooks/useSocketIO';

interface SocketIOContextType {
  socket: SocketIOClient | null;
  isConnected: boolean;
}

const SocketIOContext = createContext<SocketIOContextType | undefined>(undefined);

interface SocketIOProviderProps {
  children: ReactNode;
  socket: SocketIOClient | null;
  isConnected: boolean;
}

export function SocketIOProvider({ children, socket, isConnected }: SocketIOProviderProps) {
  return (
    <SocketIOContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketIOContext.Provider>
  );
}

export function useSocketIOContext(): SocketIOContextType {
  const context = useContext(SocketIOContext);
  if (context === undefined) {
    throw new Error('useSocketIOContext must be used within a SocketIOProvider');
  }
  return context;
}
