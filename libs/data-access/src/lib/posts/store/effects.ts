import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { postsActions } from './actions';
import { Post, PostService } from '../data';

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

  createPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createPost),
      switchMap(({ payload }) => {
        return this.postService.createPost(payload).pipe(
          map((post: Post) => postsActions.createPostSuccess({ post })),
          catchError((error: unknown) => of(postsActions.createPostFailure({ error })))
        );
      })
    );
  });

  createComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createComment),
      switchMap(({ payload }) => {
        return this.postService.createComment(payload).pipe(
          switchMap(() => {
            return this.postService
              .getCommentsByPostId(payload.postId)
              .pipe(
                map((post) => postsActions.createCommentSuccess({ postId: payload.postId, comments: post.comments }))
              );
          }),
          catchError((error: unknown) => of(postsActions.createCommentFailure({ error })))
        );
      })
    );
  });

  /**/
}
