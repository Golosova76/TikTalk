import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '@tt/shared';
import { Store } from '@ngrx/store';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { selectCurrentUserMe } from '../../../current-user';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);

  readonly me = this.store.selectSignal(selectCurrentUserMe);

  chatUrl = `${BASE_API_URL}chat/`;
  messageUrl = `${BASE_API_URL}message/`;

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatUrl}${chatId}`);
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
