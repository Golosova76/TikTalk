export interface Profile {
  id: number;
  username: string;
  avatarUrl: string | null;
  subscribersAmount: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  stack: string[];
  city: string;
  description: string;
}

//параметры запроса
export type ProfileFilterParams = Partial<{
  firstName: string;
  lastName: string;
  stack: string;
  page: number;
  size: number;
}>;

//состояние формы ввода
export interface ProfileFiltersState {
  firstName: string;
  lastName: string;
  stack: string;
}
