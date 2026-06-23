import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '../../profile';
import { currentUserActions } from './actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserEffects {
  private readonly profileService = inject(ProfileService);
  actions$ = inject(Actions);

  loadMe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(currentUserActions.loadMe),
      switchMap(() =>
        this.profileService.getMe().pipe(
          map((me) => currentUserActions.loadMeSuccess({ me })),
          catchError((error) => of(currentUserActions.loadMeFailure({ error })))
        )
      )
    );
  });

  patchMe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(currentUserActions.patchMe),
      switchMap(({ profile }) =>
        this.profileService.patchProfile(profile).pipe(
          map((me) => currentUserActions.patchMeSuccess({ me })),
          catchError((error) => of(currentUserActions.patchMeFailure({ error })))
        )
      )
    );
  });

  saveSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(currentUserActions.saveSettings),
      switchMap(({ profile, avatar }) => {
        const patchProfile$ = this.profileService.patchProfile(profile);

        const saveSettingsRequest$ = avatar
          ? this.profileService.uploadAvatar(avatar).pipe(switchMap(() => patchProfile$))
          : patchProfile$;

        return saveSettingsRequest$.pipe(
          map((me) => currentUserActions.saveSettingsSuccess({ me })),
          catchError((error: unknown) => of(currentUserActions.saveSettingsFailure({ error })))
        );
      })
    );
  });
}
