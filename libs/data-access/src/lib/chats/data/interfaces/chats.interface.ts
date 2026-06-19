import { Profile } from '../../../profile/data';

export interface Chat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
}

export interface Message {
  id: number;
  userFromId: number;
  personalChatId: number;
  text: string;
  createdAt: string;
  isRead: boolean;
  updatedAt: string;
}

export interface LastMessageRes {
  id: number;
  userFrom: Profile;
  message: string | null;
  createdAt: string | null;
  unreadMessages: number;
}

export interface MessageGroup {
  dateTitle: string;
  messages: MessageView[];
}

export interface ChatView extends Chat {
  companion: Profile;
  messages: MessageView[];
}

export interface MessageView extends Message {
  user: Profile;
  isMine: boolean;
}
