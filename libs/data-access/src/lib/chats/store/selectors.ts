import { chatsFeature } from './reducer';
import { createSelector } from '@ngrx/store';

export const selectActiveChat = chatsFeature.selectActiveChat;
export const selectChatsLastMessage = chatsFeature.selectChatsLastMessage;

export const selectChatsLoading = chatsFeature.selectLoadingChatsLastMessage;
export const selectActiveChatLoading = chatsFeature.selectLoadingActiveChat;
export const selectChatsError = chatsFeature.selectError;

export const selectUnreadMessagesCount = chatsFeature.selectTotalUnreadCount;

export const selectActiveChatMessages = createSelector(selectActiveChat, (activeChat) =>
  activeChat ? activeChat.messages : []
);

export const selectWsConnectionStatus = chatsFeature.selectWsConnectionStatus;
export const selectWsShouldReconnect = chatsFeature.selectWsShouldReconnect;
