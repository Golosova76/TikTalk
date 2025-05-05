import { Injectable } from '@angular/core';
import {Message, MessageGroup} from "../interfaces/chats.interface";

@Injectable({
  providedIn: 'root'
})
export class MessageGroupDateService {
  groupMessagesByDate (messages: Message[]): MessageGroup[] {
    const map = new Map<string, Message[]>();

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    for (const message of messages) {
      const msgDate = new Date(message.createdAt);

      const key = msgDate.toISOString().slice(0, 10);

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push(message);
    }

    const result: MessageGroup[] = [];

    for (const [key, groupMessages] of map) {
      const date = new Date(key); // обратно в Date из ISO
      const label = this.getDateTitle(date, today, yesterday);

      result.push({
        dateTitle: label,
        messages: groupMessages,
      });
    }

    result.sort((a, b) =>
      new Date(a.messages[0].createdAt).getTime() -
      new Date(b.messages[0].createdAt).getTime()
    );

    return result;
  }

  private getDateTitle (date: Date, today: Date, yesterday: Date): string {
    const dateStr = date.toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (dateStr === todayStr) {
      return 'Сегодня';
    }
    if (dateStr === yesterdayStr) {
      return 'Вчера';
    }

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

}
