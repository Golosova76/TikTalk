import { inject, Injectable } from '@angular/core';
import { ProfileFilterParams, ProfileFiltersState, ProfileService } from '../data';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import {catchError, map, of, switchMap} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  private readonly profileService = inject(ProfileService);
  actions$ = inject(Actions);

  loadSubscribers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.loadSubscribers),
      switchMap(() => {
        return this.profileService.getSubscribers().pipe(
          map((response) =>  profileActions.loadSubscribersSuccess({ subscribers: response.items })),
          catchError((error: unknown) => of(profileActions.loadSubscribersFailure({ error })))
        );
      }),
    );
  });

  filterProfiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({ filtersForm }) => {
        const filters = this.mapFiltersFormToParams(filtersForm);
        return this.profileService.filterProfiles(filters);
      }),
      map((response) => profileActions.filterProfilesSuccess({ profiles: response.items }))
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
