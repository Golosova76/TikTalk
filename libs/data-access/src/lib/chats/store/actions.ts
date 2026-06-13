import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Chat, ChatView, LastMessageRes, Message } from '../data';

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
  },
});
