import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { ProfileService } from './profile.service';
import { map, tap } from 'rxjs';
import { BASE_API_URL } from '../links.constants';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  me = inject(ProfileService).me;

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
        const currentMeId = this.me()!.id;
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
