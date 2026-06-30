import { AddressFormValue } from './form.model';

export interface DaDataAddressRequest {
  query: string;
  count?: number;
}

export interface DaDataAddressResponse {
  suggestions: DaDataAddressSuggestion[];
}

export interface DaDataAddressSuggestion {
  value: string;
  data: DaDataAddressData;
}

export interface DaDataAddressData {
  city: string | null;
  settlement: string | null; // все, что не город
  street: string | null;
  house: string | null;
  block: string | null; //корпус/строение/литера
  flat: string | null;
}

export interface AddressHint {
  label: string;
  address: AddressFormValue;
}
