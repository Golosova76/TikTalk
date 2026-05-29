import { Component, input } from '@angular/core';
import {AvatarCircleComponent, LuxonDatePipe} from "@tt/common-ui";
import { PostComment } from "../../data";

@Component({
  selector: 'tt-comment',
  imports: [AvatarCircleComponent, LuxonDatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
