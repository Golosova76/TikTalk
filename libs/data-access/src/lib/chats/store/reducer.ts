import { createFeature, createReducer, on } from '@ngrx/store';
import { ChatView, LastMessageRes } from '../data';
import { chatsActions } from './actions';

export interface ChatsState {
  activeChat: ChatView | null;
  chatsLastMessage: LastMessageRes[];

  loadingActiveChat: boolean;
  loadingChatsLastMessage: boolean;
  creatingChat: boolean;

  error: unknown | null;
}

export const chatsInitialState: ChatsState = {
  activeChat: null,
  chatsLastMessage: [],
  loadingActiveChat: false,
  loadingChatsLastMessage: false,
  creatingChat: false,
  error: null,
};

export const chatsFeature = createFeature({
  name: 'chatsFeature',
  reducer: createReducer(
    chatsInitialState,

    /*load Chats*/
    on(chatsActions.loadMyChats, (state) => ({
      ...state,
      loadingChatsLastMessage: true,
      error: null,
    })),

    on(chatsActions.loadMyChatsSuccess, (state, payload) => ({
      ...state,
      chatsLastMessage: payload.chats,
      loadingChatsLastMessage: false,
      error: null,
    })),

    on(chatsActions.loadMyChatsFailure, (state, payload) => ({
      ...state,
      loadingChatsLastMessage: false,
      error: payload.error,
    })),

    /*load Chat by ID*/
    on(chatsActions.loadChatById, (state) => ({
      ...state,
      loadingActiveChat: true,
      error: null,
    })),

    on(chatsActions.loadChatByIdSuccess, (state, payload) => ({
      ...state,
      activeChat: payload.chat,
      loadingActiveChat: false,
      error: null,
    })),

    on(chatsActions.loadChatByIdFailure, (state, payload) => ({
      ...state,
      loadingActiveChat: false,
      error: payload.error,
    })),

    /*create Chat*/
    on(chatsActions.createChat, (state) => ({
      ...state,
      creatingChat: true,
      error: null,
    })),

    on(chatsActions.createChatSuccess, (state) => ({
      ...state,
      creatingChat: false,
      error: null,
    })),

    on(chatsActions.createChatFailure, (state, payload) => ({
      ...state,
      creatingChat: false,
      error: payload.error,
    }))

    /**/
  ),
});
