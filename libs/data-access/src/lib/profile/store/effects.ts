import { inject, Injectable } from '@angular/core';
import { ProfileFilterParams, ProfileFiltersState, ProfileService } from '../data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectProfileFiltersForm, selectProfilesPageParams } from './selectors';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  private readonly profileService = inject(ProfileService);
  private readonly store = inject(Store);
  actions$ = inject(Actions);

  loadSubscribers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.loadSubscribers),
      switchMap(() => {
        return this.profileService.getSubscribers().pipe(
          map((response) => profileActions.loadSubscribersSuccess({ subscribers: response.items })),
          catchError((error: unknown) => of(profileActions.loadSubscribersFailure({ error })))
        );
      })
    );
  });

  filterProfiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents, profileActions.loadProfilesPage),
      withLatestFrom(this.store.select(selectProfileFiltersForm), this.store.select(selectProfilesPageParams)),
      switchMap(([, filtersForm, pageParams]) => {
        const filters = this.mapFiltersFormToParams(filtersForm);
        const params: ProfileFilterParams = {
          ...filters,
          ...pageParams,
        };
        return this.profileService.filterProfiles(params).pipe(
          map((response) => profileActions.filterProfilesSuccess({ profilesPage: response })),
          catchError((error: unknown) => of(profileActions.filterProfilesFailure({ error })))
        );
      })
    );
  });

  private mapFiltersFormToParams(filtersForm: ProfileFiltersState): ProfileFilterParams {
    const params: ProfileFilterParams = {};

    if (filtersForm.firstName.trim()) {
      params.firstName = filtersForm.firstName.trim();
    }
    if (filtersForm.lastName.trim()) {
      params.lastName = filtersForm.lastName.trim();
    }
    if (filtersForm.stack.trim()) {
      params.stack = filtersForm.stack.trim();
    }
    return params;
  }
}
