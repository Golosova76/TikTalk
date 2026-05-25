import { Component, input } from '@angular/core';
import { LastMessageRes } from '../../../data/interfaces/chats.interface';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { LuxonDatePipe } from '../../../helpers/pipes/luxon-date.pipe';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, LuxonDatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();
}
