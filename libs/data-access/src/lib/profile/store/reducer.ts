import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';
import { Profile } from '../data';
import { ProfileFiltersState } from '../data/interfaces/profile.interface';

export interface ProfileState {
  profiles: Profile[];
  filtersForm: ProfileFiltersState;
  loading: boolean;
  error: unknown | null;
}

export const initialState: ProfileState = {
  profiles: [],
  filtersForm: {
    firstName: '',
    lastName: '',
    stack: '',
  },
  loading: false,
  error: null,
};

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,

    on(profileActions.filterEvents, (state, payload) => ({
      ...state,
      filtersForm: payload.filtersForm,
      loading: true,
      error: null,
    })),

    on(profileActions.filterProfilesSuccess, (state, payload) => ({
      ...state,
      profiles: payload.profiles,
      loading: false,
      error: null,
    })),

    on(profileActions.filterProfilesFailure, (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }))
  ),
});
