import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Chat, ChatView, LastMessageRes } from '../data';
import { ChatWSCloseInfo, ChatWSNewMessage } from '../data/interfaces/chats-websocket.interface';

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

    /* WebSocket */
    'ws connect': emptyProps(), // WS хочу открыть
    'ws connected': emptyProps(), // WS успешно открылся
    'ws connect failure': props<{ error: unknown }>(), // ошибка подключения WS или работы WS

    'ws disconnected': props<{ closeInfo?: ChatWSCloseInfo }>(), // закрытие соединения WS
    'ws reconnect': emptyProps(), // заново подключится
    'ws disconnect': emptyProps(), // закрыть WS вручную

    'ws unread received': props<{ count: number }>(), // с сервера пришло обновл кол-во unread
    'ws new message received': props<{ message: ChatWSNewMessage }>(), //сервер прислал новое сообщение
    'ws error received': props<{ error: string }>(), //сервер прислал ошибку через WS

    'ws send message': props<{ text: string; chatId: number }>(),
  },
});
