import {Component, inject, input} from '@angular/core';
import {Post} from "../../../data/interfaces/post.interface";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {DatePipe} from "@angular/common";
import {PostInputComponent} from "../post-input/post-input.component";
import {firstValueFrom} from "rxjs";
import {ProfileService} from "../../../data/services/profile.service";
import {PostService} from "../../../data/services/post.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    DatePipe,
    PostInputComponent,
    FormsModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  postService = inject(PostService);

  post = input<Post>();
  text = '';

  profile = inject(ProfileService).me;

  onCreateComment() {
    const user = this.profile();
    if (!user || !this.text) return;

    firstValueFrom(
      this.postService.createComment({
        text: this.text,
        authorId: user.id,
        postId: 0,
        commentId: 0,
      })
    ).then(() => {
      this.text = '';
    });

  }
}
