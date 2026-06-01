import { createFeature, createReducer, on } from '@ngrx/store';
import { postsActions } from './actions';
import {Post} from "../data";

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: unknown | null;
}

export const postInitialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    postInitialState,

    on(postsActions.loadPosts, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(postsActions.loadPostsSuccess, (state, payload) => ({
      ...state,
      posts: payload.posts,
      loading: false,
      error: null,
    })),

    on(postsActions.loadPostsFailure, (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }))
  ),
});
