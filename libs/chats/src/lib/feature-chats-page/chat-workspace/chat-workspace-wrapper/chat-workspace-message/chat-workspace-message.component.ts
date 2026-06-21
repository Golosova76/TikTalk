import {ChangeDetectionStrategy, Component, HostBinding, input} from '@angular/core';
import { AvatarCircleComponent, LuxonDatePipe } from '@tt/common-ui';
import { MessageView } from '@tt/data-access';

@Component({
  selector: 'tt-chat-workspace-message',
  imports: [AvatarCircleComponent, LuxonDatePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceMessageComponent {
  message = input.required<MessageView>();

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }
}
