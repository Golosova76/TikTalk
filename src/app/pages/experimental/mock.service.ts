import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Address, ExtraServices, Product } from '../../data/form.model';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  getExtraServices(): Observable<ExtraServices[]> {
    return of([
      {
        code: 'call',
        label: 'Позвонить перед доставкой',
        value: false,
      },
      {
        code: 'floor',
        label: 'Поднять на этаж',
        value: false,
      },
      {
        code: 'receipt',
        label: 'Отправить электронный чек',
        value: true,
      },
    ]);
  }

  getAddresses(): Observable<Address[]> {
    return of([
      {
        city: 'Москва',
        street: 'Тверская',
        house: '14',
        building: '',
        apartment: '32',
      },
      {
        city: 'Санкт-Петербург',
        street: 'Бухарестская',
        house: '18A',
        building: '4',
        apartment: '30',
      },
    ]);
  }

  getProducts(): Observable<Product[]> {
    return of([
      {
        id: 'garden-gloves',
        title: 'Садовые перчатки',
        stock: 25,
        price: 350,
      },
      {
        id: 'watering-can',
        title: 'Лейка садовая 10 л',
        stock: 8,
        price: 900,
      },
      {
        id: 'tomato-seeds',
        title: 'Семена томатов',
        stock: 40,
        price: 120,
      },
      {
        id: 'garden-shovel',
        title: 'Лопата садовая',
        stock: 6,
        price: 1500,
      },
      {
        id: 'fertilizer',
        title: 'Удобрение универсальное 5 кг',
        stock: 12,
        price: 750,
      },
    ]);
  }
}
