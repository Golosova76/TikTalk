import { Chat, ChatView, LastMessageRes, Message, MessageGroup, MessageView } from './interfaces/chats.interface';
import { ChatsService } from './services/chats.service';
import { MessageGroupDateService } from './services/message-group-date.service';
import {getTotalUnreadCount, markChatAsRead } from "./utils";

export type { Chat, LastMessageRes, MessageGroup, Message, ChatView, MessageView };
export { ChatsService, MessageGroupDateService };
export { markChatAsRead, getTotalUnreadCount };

export * from './interfaces/chat-ws-service.interface';
