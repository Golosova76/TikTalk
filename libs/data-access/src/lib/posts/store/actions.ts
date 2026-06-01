import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Post } from "../data";


export const postsActions = createActionGroup({
  source: 'Posts',
  events: {
    'load posts': emptyProps(),
    'load posts success': props<{ posts: Post[] }>(),
    'load posts failure': props<{ error: unknown }>(),
  },
});
