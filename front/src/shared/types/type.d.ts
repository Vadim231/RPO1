import { IStaticMethods } from 'flyonui/flyonui';

declare module 'flyonui/plugin';
export interface IElectronAPI {
  windowControl: (action: 'minimize' | 'maximize' | 'close') => void;
}
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}
export interface ChatType {
  message_id: number;
  chat_id: number;
  user_id: number;
  message_content: string;
  sent_at: string;
  edited_at: string;
}
export type messageStatus = 'sent' | 'read' | 'received';
export type modifier = 'sender' | 'receiver';
import {
  AttachedImageProps,
  AttachedGalleryProps,
  AttachedFileProps,
} from '@/features/chat/types';
export interface MessageType {
  id: number;
  message_id: number;
  chat_id: number;
  user_id: number;
  user_name: string;
  user_avatar: string;
  message_content?: string;
  sent_at: string;
  edited_at: string;
  message_status: messageStatus;
  modifier: modifier;
  imageAttached?: AttachedImageProps;
  galleryAttached?: AttachedGalleryProps;
  fileAttached?: AttachedFileProps;
  sticker?: string;
}
window.HSStaticMethods.autoInit();
