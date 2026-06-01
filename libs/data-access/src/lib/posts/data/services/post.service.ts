import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs';
import { BASE_API_URL } from '@tt/shared';
import {CommentCreateDto, Post, PostComment, PostCreateDto} from "../interfaces/post.interface";


@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);

  //posts = signal<Post[]>([]);

  createPost(payload: PostCreateDto) {
    return this.http.post<Post>(`${BASE_API_URL}post/`, payload).pipe(
      switchMap(() => {
        return this.fetchPosts();
      })
    );
  }

  fetchPosts() {
    return this.http.get<Post[]>(`${BASE_API_URL}post/`);
  }

  createComment(payload: CommentCreateDto) {
    return this.http.post<PostComment>(`${BASE_API_URL}comment/`, payload).pipe();
  }

  getCommentsByPostId(postId: number) {
    return this.http.get<Post>(`${BASE_API_URL}post/${postId}`).pipe(map((res) => res.comments));
  }
}
