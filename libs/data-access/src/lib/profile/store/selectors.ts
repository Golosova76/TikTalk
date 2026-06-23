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

export const selectProfilesPageParams = createSelector(
  profileFeature.selectPage,
  profileFeature.selectSize,
  (page, size) => ({
    page,
    size,
  })
);

export const selectSubscribers = createSelector(
  profileFeature.selectSubscribers,
  (subscribers: Profile[]): Profile[] => subscribers
);

export const selectSubscribersShortList = (subsAmount = 3) =>
  createSelector(
    profileFeature.selectSubscribers,
    (subscribers: Profile[] | undefined): Profile[] => subscribers?.slice(0, subsAmount) ?? []
  );

export const selectSubscriberIds = createSelector(
  profileFeature.selectSubscriberIds,
  (ids: number[] | undefined): Set<number> => new Set(ids ?? [])
);

export const selectProfilesLoading = createSelector(
  profileFeature.selectLoading,
  (loading: boolean): boolean => loading
);

export const selectProfilesHasNextPage = createSelector(
  profileFeature.selectPage,
  profileFeature.selectPages,
  (page: number, pages: number): boolean => {
    return pages === 0 || page < pages;
  }
);
