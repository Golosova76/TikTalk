import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { BASE_API_URL } from '@tt/shared';
import { Chat, LastMessageRes, Message } from '@tt/interfaces/chats/chats.interface';
import { selectCurrentUserMe } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);

  readonly me = this.store.selectSignal(selectCurrentUserMe);

  activeChatMessages = signal<Message[]>([]);

  chatsLastMessage = signal<LastMessageRes[]>([]);

  chatUrl = `${BASE_API_URL}chat/`;
  messageUrl = `${BASE_API_URL}message/`;

  readonly unreadMessagesCount = computed(() => {
    return this.chatsLastMessage().reduce((total, chat) => {
      return total + chat.unreadMessages;
    }, 0);
  });

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http
      .get<LastMessageRes[]>(`${this.chatUrl}get_my_chats/`)
      .pipe(tap((res) => this.chatsLastMessage.set(res)));
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatUrl}${chatId}`).pipe(
      map((chat) => {
        const me = this.me();
        if (!me) {
          throw new Error('Current user is not loaded');
        }

        const currentMeId = me.id;
        const isUserFirst = chat.userFirst.id === currentMeId;
        const companion = isUserFirst ? chat.userSecond : chat.userFirst;

        const patchedMessages = chat.messages.map((message: Message) => {
          return {
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === currentMeId,
          };
        });

        this.activeChatMessages.set(patchedMessages);

        return {
          ...chat,
          companion,
          messages: patchedMessages,
        };
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: { message },
      }
    );
  }
}
