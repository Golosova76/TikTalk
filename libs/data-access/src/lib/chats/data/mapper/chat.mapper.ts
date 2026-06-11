import { Chat, ChatView, Message, MessageView } from '../interfaces/chats.interface';

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
