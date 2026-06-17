import {Observable} from "rxjs";
import {ChatWSInMessage} from "./chats-websocket.interface";

//описывает параметры подключения
export interface ChatConnectionWSParams {
  url: string;
  token: string | null;
}

export interface ChatsWebsocketAdapter {
  connect: (params: ChatConnectionWSParams) => Observable<ChatWSInMessage>;
  sendMessage: (text: string, chatId: number) => void;
  disconnect: () => void;
}
