import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';
import { Profile, ProfileFiltersState } from '../data';

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles: Profile[]): Profile[] => profiles
);

export const selectProfileFiltersForm = createSelector(
  profileFeature.selectFiltersForm,
  (filtersForm: ProfileFiltersState): ProfileFiltersState => filtersForm
);

export const selectSubscribers = createSelector(
  profileFeature.selectSubscribers,
  (subscribers: Profile[]): Profile[] => subscribers
);

export const selectSubscribersShortList = (subsAmount = 3) => createSelector(
  profileFeature.selectSubscribers,
  (subscribers: Profile[] | undefined): Profile[] =>
    subscribers?.slice(0, subsAmount) ?? []
)

export const selectSubscriberIds = createSelector(
  profileFeature.selectSubscriberIds,
  (ids: number[] | undefined): Set<number> => new Set(ids ?? [])
);
