import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { MessageGroup, MessageView } from '../interfaces/chats.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageGroupDateService {
  groupMessagesByDate(messages: MessageView[]): MessageGroup[] {
    const map = new Map<string, MessageView[]>();

    for (const message of messages) {
      const date = DateTime.fromISO(message.createdAt, { zone: 'utc' }).toLocal();

      if (!date.isValid) {
        continue;
      }

      const key = date.toFormat('yyyy-MM-dd');
      const group = map.get(key) ?? [];
      group.push(message);
      map.set(key, group);
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
