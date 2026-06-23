import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '@tt/shared';
import { Chat, LastMessageRes } from '../interfaces/chats.interface';
import { ChatsWebsocketService } from './chats-websocket.service';
import { AuthService } from '@tt/auth';
import { ChatWSInMessage } from '../interfaces/chats-websocket.interface';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly wsAdapter = inject(ChatsWebsocketService);

  chatUrl = `${BASE_API_URL}chat/`;
  chatWSUrl = `${BASE_API_URL}chat/ws`;

  /*
  connectWs(params?: {
    onOpen?: () => void;
    onClose?: (event: CloseEvent) => void;
  }): Observable<ChatWSInMessage> {
    return this.wsAdapter.connect({
      url: this.chatWSUrl,
      token: this.authService.getValidAccessToken(),
      onOpen: params?.onOpen,
      onClose: params?.onClose,
    });
  }
*/
  connectWs(params?: { onOpen?: () => void; onClose?: (event: CloseEvent) => void }): Observable<ChatWSInMessage> {
    return this.authService.getValidAccessToken().pipe(
      switchMap((token) => {
        return this.wsAdapter.connect({
          url: this.chatWSUrl,
          token,
          onOpen: params?.onOpen,
          onClose: params?.onClose,
        });
      })
    );
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatUrl}${chatId}`);
  }

  sendWsMessage(text: string, chatId: number): void {
    this.wsAdapter.sendMessage(text, chatId);
  }

  disconnectWs(): void {
    this.wsAdapter.disconnect();
  }
}
