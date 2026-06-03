import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../data';

export const postsActions = createActionGroup({
  source: 'Posts',
  events: {
    'load posts': emptyProps(),
    'load posts success': props<{ posts: Post[] }>(),
    'load posts failure': props<{ error: unknown }>(),

    'create post': props<{ payload: PostCreateDto }>(),
    'create post success': props<{ post: Post }>(),
    'create post failure': props<{ error: unknown }>(),

    'create comment': props<{ payload: CommentCreateDto }>(),
    'create comment success': props<{ postId: number; comments: PostComment[] }>(),
    'create comment failure': props<{ error: unknown }>(),
  },
});
