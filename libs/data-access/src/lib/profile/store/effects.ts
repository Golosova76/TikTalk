import { inject, Injectable } from '@angular/core';
import { ProfileService } from '../data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  private readonly profileService = inject(ProfileService);
  actions$ = inject(Actions);

  filterProfiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({ filters }) => {
        return this.profileService.filterProfiles(filters);
      }),
      map((response) => profileActions.filterProfilesSuccess({ profiles: response.items }))
    );
  });
}
