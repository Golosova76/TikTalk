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
