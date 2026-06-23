export interface ChatWSUnreadMessage {
  status: 'success';
  action: 'unread';
  data: { count: number };
}

export interface ChatWSNewMessage {
  status: 'success';
  action: 'message';
  data: ChatWSMessageData;
}

export interface ChatWSError {
  status: 'error';
  message: string;
}

export interface ChatWSSendMessage {
  text: string;
  chat_id: number;
}

export interface ChatWSMessageData {
  id: number;
  message: string;
  chat_id: number;
  created_at: string;
  author: number;
}

export type ChatWSInMessage = ChatWSUnreadMessage | ChatWSNewMessage | ChatWSError; // пришло с сервера

export type ChatWSSocketMessage = ChatWSInMessage | ChatWSSendMessage; // общий тип для WebSocketSubject

export function isServerMessage(message: ChatWSSocketMessage): message is ChatWSInMessage {
  return 'status' in message;
}

export function isWSUnreadMessage(message: ChatWSInMessage): message is ChatWSUnreadMessage {
  return message.status === 'success' && message.action === 'unread';
}

export function isWSNewMessage(message: ChatWSInMessage): message is ChatWSNewMessage {
  return message.status === 'success' && message.action === 'message';
}

export function isWSErrorMessage(message: ChatWSInMessage): message is ChatWSError {
  return message.status === 'error';
}

export type ChatWsConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface ChatWSCloseInfo {
  code: number;
  reason: string;
  wasClean: boolean;
}
