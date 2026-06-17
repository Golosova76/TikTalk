import { Chat, ChatView, Message, MessageView } from '../interfaces/chats.interface';
import {ChatWSMessageData} from "../interfaces/chats-websocket.interface";

export function patchChatWithCurrentUser(chat: Chat, currentUserId: number): ChatView {
  const isUserFirst = chat.userFirst.id === currentUserId;
  const companion = isUserFirst ? chat.userSecond : chat.userFirst;

  const messages: MessageView[] = chat.messages.map((message: Message): MessageView => {
    return {
      ...message,
      user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
      isMine: message.userFromId === currentUserId,
    };
  });

  return {
    ...chat,
    companion,
    messages,
  };
}

export function mapWSMessageDataToMessageView(message: ChatWSMessageData, chat: ChatView): MessageView | null {
  const user =
    message.author === chat.userFirst.id
      ? chat.userFirst
      : message.author === chat.userSecond.id
        ? chat.userSecond
        : null;

  if (!user) {
    return null;
  }

  return {
    id: message.id,
    userFromId: message.author,
    personalChatId: message.chat_id,
    text: message.message,
    createdAt: normalizeWSDate(message.created_at),
    updatedAt: normalizeWSDate(message.created_at),
    isRead: false,
    user,
    isMine: user.id !== chat.companion.id,
  };
}

function normalizeWSDate(date: string): string {
  return date.replace(' ', 'T');
}
