import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'luxonDate',
})
export class LuxonDatePipe implements PipeTransform {
  transform(value: string | null | undefined, format = 'HH:mm dd.MM.yyyy'): string {
    if (!value) {
      return '';
    }

    const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();

    if (!date.isValid) {
      return '';
    }

    return date.toFormat(format);
  }
}
