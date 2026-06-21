import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import { AvatarCircleComponent, LuxonDatePipe } from '@tt/common-ui';
import { PostComment } from '@tt/data-access';

@Component({
  selector: 'tt-comment',
  imports: [AvatarCircleComponent, LuxonDatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  comment = input<PostComment>();
}
