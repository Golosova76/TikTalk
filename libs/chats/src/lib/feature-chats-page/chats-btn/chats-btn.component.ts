import { Component, input } from '@angular/core';
import { AvatarCircleComponent, LuxonDatePipe } from '@tt/common-ui';
import { LastMessageRes } from '@tt/interfaces/chats';

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
