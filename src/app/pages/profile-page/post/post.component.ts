import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Post, PostComment} from "../../../data/interfaces/post.interface";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {DatePipe} from "@angular/common";
import {PostInputComponent} from "../post-input/post-input.component";
import {firstValueFrom} from "rxjs";
import {ProfileService} from "../../../data/services/profile.service";
import {PostService} from "../../../data/services/post.service";
import {FormsModule} from "@angular/forms";
import {CommentComponent} from "./comment/comment.component";
import {SortCommentsPipe} from "../../../helpers/pipes/sort-comments.pipe";


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    DatePipe,
    PostInputComponent,
    FormsModule,
    CommentComponent,
    SortCommentsPipe
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  postService = inject(PostService);

  post = input<Post>();

  comments = signal<PostComment[]>([]);

  profile = inject(ProfileService).me;

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

    const updatedComments = await firstValueFrom(
      this.postService.getCommentsByPostId(post.id)
    );
    this.comments.set(updatedComments);

  }
}
