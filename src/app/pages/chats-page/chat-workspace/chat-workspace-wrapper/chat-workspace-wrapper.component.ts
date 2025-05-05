import {Component, inject, input} from '@angular/core';
import {PostInputComponent} from "../../../profile-page/post-input/post-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {ChatWorkspaceMessageComponent} from "./chat-workspace-message/chat-workspace-message.component";
import {Chat} from "../../../../data/interfaces/chats.interface";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-chat-workspace-wrapper',
  standalone: true,
  imports: [
    PostInputComponent,
    ChatWorkspaceMessageComponent
  ],
  templateUrl: './chat-workspace-wrapper.component.html',
  styleUrl: './chat-workspace-wrapper.component.scss'
})
export class ChatWorkspaceWrapperComponent {
  chatService = inject(ChatsService);

  chat = input.required<Chat>();

  messages = this.chatService.activeChatMessages;

  async onCreateMessage(data: { text: string }) {
    await firstValueFrom(
      this.chatService.sendMessage(this.chat().id, data.text)
    )

    await firstValueFrom(this.chatService.getChatById(this.chat().id))
  }

}
