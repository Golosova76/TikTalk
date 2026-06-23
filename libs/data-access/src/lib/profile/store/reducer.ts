import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';
import { Profile } from '../data';
import { ProfileFiltersState } from '../data/interfaces/profile.interface';

export interface ProfileState {
  profiles: Profile[];
  filtersForm: ProfileFiltersState;

  page: number;
  size: number;
  total: number;
  pages: number;

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

  page: 1,
  size: 10,
  total: 0,
  pages: 0,

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

    /* filter */
    on(profileActions.filterEvents, (state, payload) => ({
      ...state,
      profiles: [],
      filtersForm: payload.filtersForm,
      page: 1,
      total: 0,
      pages: 0,
      loading: true,
      error: null,
    })),

    on(profileActions.filterProfilesSuccess, (state, { profilesPage }) => ({
      ...state,
      profiles: state.profiles.concat(profilesPage.items),
      page: profilesPage.page,
      size: profilesPage.size,
      total: profilesPage.total,
      pages: profilesPage.pages,
      loading: false,
      error: null,
    })),

    on(profileActions.filterProfilesFailure, (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    })),

    on(profileActions.loadProfilesPage, (state, payload) => {
      const page = payload.page ?? state.page + 1;

      return {
        ...state,
        page,
        loading: true,
        error: null,
      };
    }),

    /* Subscribers */
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
    }))
  ),
});
