import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '../../profile/data';

export const currentUserActions = createActionGroup({
  source: 'Current user',
  events: {
    'load me': emptyProps(),
    'load me success': props<{ me: Profile }>(),
    'load me failure': props<{ error: unknown }>(),

    'patch me': props<{ profile: Partial<Profile> }>(),
    'patch me success': props<{ me: Profile }>(),
    'patch me failure': props<{ error: unknown }>(),

    'save settings': props<{ profile: Partial<Profile>; avatar: File | null; }>(),
    'save settings success': props<{ me: Profile }>(),
    'save settings failure': props<{ error: unknown }>(),
  },
});
