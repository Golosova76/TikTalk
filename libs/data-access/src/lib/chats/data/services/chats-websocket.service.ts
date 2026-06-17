import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {ChatConnectionWSParams, ChatsWebsocketAdapter} from "../interfaces/chat-ws-service.interface";
import {filter, Observable, tap} from "rxjs";
import {
  ChatWSInMessage,
  ChatWSSendMessage,
  ChatWSSocketMessage,
  isServerMessage
} from "../interfaces/chats-websocket.interface";

@Injectable({
  providedIn: 'root',
})
export class ChatsWebsocketService implements ChatsWebsocketAdapter {
  #socket: WebSocketSubject<ChatWSSocketMessage> | null = null;

  connect(params: ChatConnectionWSParams): Observable<ChatWSInMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        ...(params.token ? { protocol: params.token } : {}),
        openObserver: {
          next: () => {
            params.onOpen?.();
          },
        },
        closeObserver: {
          next: (event: CloseEvent) => {
            this.#socket = null;
            params.onClose?.(event);
          },
        },
      });
    }
    return this.#socket.asObservable().pipe(
      filter(isServerMessage),
      tap({ error: () => { this.#socket = null } })
    );
  }

  disconnect(): void {
    this.#socket?.complete();
    this.#socket = null;
  }

  sendMessage(text: string, chatId: number) {
    const payload: ChatWSSendMessage = { text, chat_id: chatId };
    this.#socket?.next(payload);
  }

}
