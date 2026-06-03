import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '@tt/shared';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);

  createPost(payload: PostCreateDto) {
    return this.http.post<Post>(`${BASE_API_URL}post/`, payload);
  }

  fetchPosts() {
    return this.http.get<Post[]>(`${BASE_API_URL}post/`);
  }

  createComment(payload: CommentCreateDto) {
    return this.http.post<PostComment>(`${BASE_API_URL}comment/`, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.http.get<Post>(`${BASE_API_URL}post/${postId}`);
  }

  deletePost(postId: number) {
    return this.http.delete<void>(`${BASE_API_URL}post/${postId}`);
  }
}
