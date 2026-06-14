import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';
import { Profile } from '../data';
import { ProfileFiltersState } from '../data/interfaces/profile.interface';

export interface ProfileState {
  profiles: Profile[];
  filtersForm: ProfileFiltersState;
  subscribers: Profile[];
  subscriberIds: number[];
  loading: boolean;
  loadingSubscribers: boolean;
  error: unknown | null;
}

export const profileInitialState: ProfileState = {
  profiles: [],
  filtersForm: {
    firstName: '',
    lastName: '',
    stack: '',
  },
  subscribers: [],
  subscriberIds: [],
  loadingSubscribers: false,
  loading: false,
  error: null,
};

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    profileInitialState,

    /* profile */
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
    })),

    /* profile */
    on(profileActions.loadSubscribers, (state) => ({
      ...state,
      loadingSubscribers: true,
      error: null,
    })),

    on(profileActions.loadSubscribersSuccess, (state, { subscribers }) => ({
      ...state,
      subscribers,
      subscriberIds: subscribers.map((profile) => profile.id),
      loadingSubscribers: false,
      error: null,
    })),

    on(profileActions.loadSubscribersFailure, (state, { error }) => ({
      ...state,
      loadingSubscribers: false,
      error,
    })),
  ),
});
