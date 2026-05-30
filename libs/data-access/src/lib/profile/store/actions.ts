import { createActionGroup, props } from '@ngrx/store';
import { Profile, ProfileFilterParams } from '../data';

export const profileActions = createActionGroup({
  source: 'Profile',
  events: {
    'filter events': props<{ filters: ProfileFilterParams }>(),
    'filter profiles success': props<{ profiles: Profile[] }>(),
    'filter profiles failure': props<{ error: unknown }>(),
  },
});
