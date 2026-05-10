import { Injectable } from '@angular/core';
import { Message, MessageGroup } from '../interfaces/chats.interface';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class MessageGroupDateService {
  groupMessagesByDate(messages: Message[]): MessageGroup[] {
    const map = new Map<string, Message[]>();

    for (const message of messages) {
      const date = DateTime.fromISO(message.createdAt, { zone: 'utc' }).toLocal();

      if (!date.isValid) {
        continue;
      }

      const key = date.toFormat('yyyy-MM-dd');

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push(message);
    }

    const result: MessageGroup[] = [];

    for (const [key, groupMessages] of map) {
      result.push({
        dateTitle: this.getDateTitle(key),
        messages: [...groupMessages],
      });
    }

    result.sort((a, b) => {
      const firstDate = DateTime.fromISO(a.messages[0].createdAt, { zone: 'utc' }).toLocal();
      const secondDate = DateTime.fromISO(b.messages[0].createdAt, { zone: 'utc' }).toLocal();

      return firstDate.toMillis() - secondDate.toMillis();
    });

    return result;
  }

  private getDateTitle(dateKey: string): string {
    const date = DateTime.fromFormat(dateKey, 'yyyy-MM-dd');
    const today = DateTime.local().startOf('day');
    const yesterday = today.minus({ days: 1 });

    if (date.equals(today)) {
      return 'Сегодня';
    }

    if (date.equals(yesterday)) {
      return 'Вчера';
    }

    return date.setLocale('ru').toFormat('d MMMM yyyy');
  }
}
