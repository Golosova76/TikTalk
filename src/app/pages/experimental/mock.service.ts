import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ExtraServices } from '../../data/form.model';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  getExtraServices(): Observable<ExtraServices[]> {
    return of([
      {
        code: 'call',
        label: 'Позвонить перед доставкой',
        value: true,
      },
      {
        code: 'floor',
        label: 'Поднять на этаж',
        value: false,
      },
      {
        code: 'receipt',
        label: 'Отправить электронный чек',
        value: false,
      },
    ]);
  }

  getAddresses() {
    return of([
      {
        city: 'Москва',
        street: 'Тверская',
        house: '14',
        building: '',
        apartment: '32',
      },
      {
        city: 'Москва',
        street: 'Куликовская',
        house: '24',
        building: '1',
        apartment: '32',
      },
      {
        city: 'Санкт-Петербург',
        street: 'Бухарестская',
        house: '18A',
        building: '4',
        apartment: '30',
      },
      {
        city: 'Ярославль',
        street: 'Большая Октябрьская',
        house: '45',
        building: '',
        apartment: '2',
      },
    ]);
  }
}
