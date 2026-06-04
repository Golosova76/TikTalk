import { createFeature, createReducer, on } from '@ngrx/store';
import { Profile } from '../../profile/data';
import { currentUserActions } from './actions';

export interface CurrentUserState {
  me: Profile | null;
  loading: boolean;
  error: unknown | null;
}

export const currentUserInitialState: CurrentUserState = {
  me: null,
  loading: false,
  error: null,
};

export const currentUserFeature = createFeature({
  name: 'currentUserFeature',
  reducer: createReducer(
    currentUserInitialState,

    /*load me*/
    on(currentUserActions.loadMe, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(currentUserActions.loadMeSuccess, (state, { me }) => ({
      ...state,
      me,
      loading: false,
      error: null,
    })),

    on(currentUserActions.loadMeFailure, (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    })),

    /*patch me*/
    on(currentUserActions.patchMe, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(currentUserActions.patchMeSuccess, (state, { me }) => ({
      ...state,
      me,
      loading: false,
      error: null,
    })),

    on(currentUserActions.patchMeFailure, (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }))
  ),
});
