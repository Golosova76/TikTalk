import { Component, HostBinding, input } from '@angular/core';
import {AvatarCircleComponent, LuxonDatePipe} from "@tt/common-ui";
import {Message} from "@tt/interfaces/chats";


@Component({
  selector: 'tt-chat-workspace-message',
  imports: [AvatarCircleComponent, LuxonDatePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>();

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }
}
