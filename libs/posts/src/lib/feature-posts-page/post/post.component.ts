import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommentComponent } from '../../ui';
import { PostInputComponent } from '../../ui';
import { AvatarCircleComponent, LuxonDatePipe, SortCommentsPipe, SvgIconComponent } from '@tt/common-ui';
import { GlobalStoreService, Post, PostComment, PostService } from '@tt/data-access';

@Component({
  selector: 'tt-post',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    FormsModule,
    CommentComponent,
    SortCommentsPipe,
    LuxonDatePipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  postService = inject(PostService);

  post = input<Post>();

  comments = signal<PostComment[]>([]);

  profile = inject(GlobalStoreService).me;

  ngOnInit() {
    const post = this.post();
    if (post) {
      this.comments.set(post.comments);
    }
  }

  async onCreateComment(data: { text: string }) {
    const user = this.profile();
    const post = this.post();
    if (!user || !data.text || !post) return;

    await firstValueFrom(
      this.postService.createComment({
        text: data.text,
        authorId: user.id,
        postId: post.id,
        commentId: 0,
      })
    );

    const updatedComments = await firstValueFrom(this.postService.getCommentsByPostId(post.id));
    this.comments.set(updatedComments);
  }
}
