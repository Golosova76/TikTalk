import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';
import { Profile, ProfileFilterParams } from '../data';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: ProfileFilterParams;
  loading: boolean;
  error: unknown | null;
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  loading: false,
  error: null,
};

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,

    on(profileActions.filterProfilesSuccess, (state, payload) => ({
      ...state,
      profiles: payload.profiles,
    }))
  ),
});
