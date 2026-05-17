export const ReceiverType = {
  PERSON: 'PERSON',
  LEGAL: 'LEGAL',
} as const;

export type ReceiverType = (typeof ReceiverType)[keyof typeof ReceiverType];

// если адрес приходит с бэка (если будет реализовано добавить Dto -> AddressDto
export interface Address {
  city?: string;
  street?: string;
  house?: string;
  building?: string;
  apartment?: string;
}

// как адрес заполнен в форме
export interface AddressFormValue {
  city: string;
  street: string;
  house: string;
  building: string;
  apartment: string;
}

export interface ExtraServices {
  code: string;
  label: string;
  value: boolean;
}
