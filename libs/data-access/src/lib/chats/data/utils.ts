import { LastMessageRes } from "./interfaces/chats.interface";

export function markChatAsRead(chats: LastMessageRes[], chatId: number | null | undefined): LastMessageRes[] {
  if (chatId == null) {
    return chats;
  }

  return chats.map((chat) => {
    if (chat.id !== chatId) {
      return chat;
    }

    return {
      ...chat,
      unreadMessages: 0,
    };
  });
}

export function getTotalUnreadCount(chats: LastMessageRes[]): number {
  return chats.reduce((total, chat) => total + chat.unreadMessages, 0);
}
