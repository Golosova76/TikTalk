import { createFeature, createReducer, on } from '@ngrx/store';
import { postsActions } from './actions';
import { Post } from '../data';

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

    /*load Posts*/
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
    })),

    /*create Post*/
    on(postsActions.createPost, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(postsActions.createPostSuccess, (state, payload) => ({
      ...state,
      posts: [payload.post, ...state.posts],
      loading: false,
      error: null,
    })),

    on(postsActions.createPostFailure, (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    }))
  ),
});
