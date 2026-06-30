import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DADATA_API_KEY } from './dadata.config';
import {
  AddressHint,
  DaDataAddressRequest,
  DaDataAddressResponse,
  DaDataAddressSuggestion,
} from '../interfaces/dadata-address.interface';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DaDataService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  getAddressSuggestion(query: string): Observable<AddressHint[]> {
    const preparedQuery = query.trim();

    if (preparedQuery.length === 0) {
      return of([]);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${DADATA_API_KEY}`,
    });

    const body: DaDataAddressRequest = {
      query: preparedQuery,
      count: 5,
    };

    return this.http
      .post<DaDataAddressResponse>(this.apiUrl, body, { headers: headers })
      .pipe(map((response) => response.suggestions.map((suggestion) => this.toAddressHint(suggestion))));
  }

  private toAddressHint(suggestion: DaDataAddressSuggestion): AddressHint {
    const data = suggestion.data;

    return {
      label: suggestion.value,
      address: {
        city: data.city ?? data.settlement ?? '',
        street: data.street ?? '',
        house: data.house ?? '',
        building: data.block ?? '',
        apartment: data.flat ?? '',
      },
    };
  }
}
