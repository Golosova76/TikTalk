import {createActionGroup, emptyProps, props} from '@ngrx/store';
import { Profile, ProfileFiltersState } from '../data';

export const profileActions = createActionGroup({
  source: 'Profile',
  events: {
    'filter events': props<{ filtersForm: ProfileFiltersState }>(),
    'filter profiles success': props<{ profiles: Profile[] }>(),
    'filter profiles failure': props<{ error: unknown }>(),

    'load subscribers': emptyProps(),
    'load subscribers success': props<{ subscribers: Profile[] }>(),
    'load subscribers failure': props<{ error: unknown }>(),
  },
});
