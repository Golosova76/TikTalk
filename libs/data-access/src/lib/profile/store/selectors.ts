import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';
import { Profile } from '../data';

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles: Profile[]): Profile[] => profiles
);
