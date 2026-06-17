import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Chat, ChatView, LastMessageRes, Message } from '../data';
import {ChatWSInMessage, ChatWSNewMessage} from "../data/interfaces/chats-websocket.interface";

export const chatsActions = createActionGroup({
  source: 'Chats',
  events: {
    'load my chats': emptyProps(),
    'load my chats success': props<{ chats: LastMessageRes[] }>(),
    'load my chats failure': props<{ error: unknown }>(),

    'load chat by id': props<{ chatId: number }>(),
    'load chat by id success': props<{ chat: ChatView }>(),
    'load chat by id failure': props<{ error: unknown }>(),

    'create chat': props<{ userId: number }>(),
    'create chat success': props<{ chat: Chat }>(),
    'create chat failure': props<{ error: unknown }>(),

    'send message': props<{ chatId: number; text: string }>(),
    'send message success': props<{ chatId: number; message: Message }>(),
    'send message failure': props<{ error: unknown }>(),

    'ws connect': emptyProps(),
    'ws connect failure': props<{ error: unknown }>(),

    'ws message received': props<{ message: ChatWSInMessage }>(),
    'ws unread received': props<{ count: number }>(),
    'ws new message received': props<{ message: ChatWSNewMessage }>(),
    'ws error received': props<{ error: string }>(),

    'ws send message': props<{ text: string; chatId: number }>(),
  },
});
