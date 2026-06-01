import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { postsActions } from './actions';
import {PostService} from "../data";

@Injectable({
  providedIn: 'root',
})
export class PostEffects {
  private readonly postService = inject(PostService);
  actions$ = inject(Actions);

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.loadPosts),
      switchMap(() => {
        return this.postService.fetchPosts().pipe(
          map((posts) => postsActions.loadPostsSuccess({ posts })),
          catchError((error: unknown) => of(postsActions.loadPostsFailure({ error })))
        );
      })
    );
  });
}
