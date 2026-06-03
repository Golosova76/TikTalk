import { createFeature, createReducer, on } from '@ngrx/store';
import { postsActions } from './actions';
import { Post } from '../data';

export interface PostsState {
  posts: Post[];
  loading: boolean;
  deletingPostId: number | null;
  error: unknown | null;
}

export const postInitialState: PostsState = {
  posts: [],
  loading: false,
  deletingPostId: null,
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
    })),

    /*create Comment*/
    on(postsActions.createComment, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(postsActions.createCommentSuccess, (state, payload) => ({
      ...state,
      posts: state.posts.map((post) => {
        if (post.id !== payload.postId) return post;
        return {
          ...post,
          comments: payload.comments,
        };
      }),
      loading: false,
      error: null,
    })),

    on(postsActions.createCommentFailure, (state, payload) => ({
      ...state,
      loading: false,
      error: payload.error,
    })),

    /*delete Post*/
    on(postsActions.deletePost, (state, payload) => ({
      ...state,
      deletingPostId: payload.postId,
      error: null,
    })),

    on(postsActions.deletePostSuccess, (state,  payload) => ({
      ...state,
      posts: state.posts.filter((post) => post.id !== payload.postId),
      deletingPostId: null,
      error: null,
    })),

    on(postsActions.deletePostFailure, (state, payload) => ({
      ...state,
      deletingPostId: null,
      error: payload.error,
    })),
    /**/
  ),
});
