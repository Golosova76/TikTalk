import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile, ProfileFiltersState } from '../data';
import { Pageble } from '../data/interfaces/pageble.interface';

export const profileActions = createActionGroup({
  source: 'Profile',
  events: {
    'filter events': props<{ filtersForm: ProfileFiltersState }>(),
    'filter profiles success': props<{ profilesPage: Pageble<Profile> }>(),
    'filter profiles failure': props<{ error: unknown }>(),

    'load profiles page': props<{ page?: number }>(),

    'load subscribers': emptyProps(),
    'load subscribers success': props<{ subscribers: Profile[] }>(),
    'load subscribers failure': props<{ error: unknown }>(),
  },
});
