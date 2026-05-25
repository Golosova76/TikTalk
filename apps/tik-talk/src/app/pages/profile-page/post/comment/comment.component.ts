import { Component, input } from '@angular/core';
import { PostComment } from '../../../../data/interfaces/post.interface';
import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component';
import { LuxonDatePipe } from '../../../../helpers/pipes/luxon-date.pipe';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, LuxonDatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
