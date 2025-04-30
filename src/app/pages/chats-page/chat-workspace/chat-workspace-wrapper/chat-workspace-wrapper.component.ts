import {Component, inject} from '@angular/core';
import {PostInputComponent} from "../../../profile-page/post-input/post-input.component";
import {ChatsService} from "../../../../data/services/chats.service";

@Component({
  selector: 'app-chat-workspace-wrapper',
  standalone: true,
  imports: [
    PostInputComponent
  ],
  templateUrl: './chat-workspace-wrapper.component.html',
  styleUrl: './chat-workspace-wrapper.component.scss'
})
export class ChatWorkspaceWrapperComponent {
  chatService = inject(ChatsService);

  async onCreateMessage(data: { text: string }) {}

}
