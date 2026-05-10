import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'luxonDate',
})
export class LuxonDatePipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    format = 'HH:mm dd.MM.yyyy',
    mode: 'default' | 'chatPreview' = 'default'
  ): string {
    if (!value) {
      return '';
    }

    const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();

    if (!date.isValid) {
      return '';
    }

    if (mode === 'chatPreview') {
      return this.formatChatPreview(date);
    }

    return date.toFormat(format);
  }

  private formatChatPreview(date: DateTime) {
    const today = DateTime.local().startOf('day');
    const messageDay = date.startOf('day');

    if (messageDay.equals(today)) {
      return date.toFormat('HH:mm');
    }
    if (messageDay.equals(today.minus({ days: 1 }))) {
      return 'Вчера';
    }
    return date.toFormat('dd.MM.yyyy');
  }
}
