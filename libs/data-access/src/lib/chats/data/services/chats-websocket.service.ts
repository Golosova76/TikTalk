import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {ChatConnectionWSParams, ChatsWebsocketAdapter} from "../interfaces/chat-ws-service.interface";
import {filter, finalize, Observable} from "rxjs";
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
        ...(params.token ? { protocol: params.token } : {})
      });
    }
    return this.#socket.asObservable().pipe(
      filter(isServerMessage),
      finalize(() => console.log('The End'))
    );
  }

  disconnect(): void {
    this.#socket?.complete();
    this.#socket = null;
  }

  sendMessage(text: string, chatId: number) {
    const payload: ChatWSSendMessage = {
      text,
      chat_id: chatId,
    };
    this.#socket?.next(payload)
  }

}
