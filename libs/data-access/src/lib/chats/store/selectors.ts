import { chatsFeature } from './reducer';
import { createSelector } from '@ngrx/store';

export const selectActiveChat = chatsFeature.selectActiveChat;
export const selectChatsLastMessage = chatsFeature.selectChatsLastMessage;

export const selectChatsLoading = chatsFeature.selectLoadingChatsLastMessage;
export const selectActiveChatLoading = chatsFeature.selectLoadingActiveChat;
export const selectChatsError = chatsFeature.selectError;

export const selectUnreadMessagesCount = createSelector(selectChatsLastMessage, (chats) =>
  chats.reduce((total, chat) => total + chat.unreadMessages, 0)
);

export const selectActiveChatMessages = createSelector(selectActiveChat, (activeChat) =>
  activeChat ? activeChat.messages : []
);
