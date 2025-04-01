import {Component, inject, OnInit} from '@angular/core';
import {PostInputComponent} from "../post-input/post-input.component";
import {PostComponent} from "../post/post.component";
import {PostService} from "../../../data/services/post.service";
import {ProfileService} from "../../../data/services/profile.service";
import {firstValueFrom} from "rxjs";


@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements OnInit {
  postService = inject(PostService);

  feed = this.postService.posts;

  profile = inject(ProfileService).me;

  ngOnInit() {
    this.postService.fetchPosts().subscribe();
  }

  onCreatePost(data: { title?: string; text: string }) {
    const user = this.profile();
    if (!user || !data.title || !data.text) return;

    firstValueFrom(
      this.postService.createPost({
        title: data.title,
        content: data.text,
        authorId: user.id
      })
    );
  }
}
