import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentComponent } from '../../ui';
import { PostInputComponent } from '../../ui';
import { AvatarCircleComponent, LuxonDatePipe, SortCommentsPipe, SvgIconComponent } from '@tt/common-ui';
import { GlobalStoreService, Post, postsActions } from '@tt/data-access';
import { Store } from '@ngrx/store';

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
export class PostComponent {
  private readonly store = inject(Store);

  protected readonly post = input.required<Post>();

  protected readonly comments = computed(() => this.post().comments);

  profile = inject(GlobalStoreService).me;

  protected onCreateComment(data: { text: string }) {
    const user = this.profile();
    const post = this.post();
    if (!user || !data.text || !post) return;

    const comment = {
      text: data.text,
      authorId: user.id,
      postId: post.id,
      commentId: 0,
    };

    this.store.dispatch(postsActions.createComment({ payload: comment }));
  }
}
