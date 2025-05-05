import {Component, inject, input, OnInit, signal} from '@angular/core';
import {PostInputComponent} from "../../../profile-page/post-input/post-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {ChatWorkspaceMessageComponent} from "./chat-workspace-message/chat-workspace-message.component";
import {Chat, MessageGroup} from "../../../../data/interfaces/chats.interface";
import {firstValueFrom} from "rxjs";
import {MessageGroupDateService} from "../../../../data/services/message-group-date.service";

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
export class ChatWorkspaceWrapperComponent implements OnInit {
  chatService = inject(ChatsService);
  messageGroupDateService = inject(MessageGroupDateService);

  chat = input.required<Chat>();

  messages = this.chatService.activeChatMessages;

  groupMessages = signal<MessageGroup[]>([])

  ngOnInit(): void {
    this.updateGroupedMessages();
  }


  updateGroupedMessages(): void {
    const current = this.messages();
    const grouped = this.messageGroupDateService.groupMessagesByDate(current);
    this.groupMessages.set(grouped);
  }

  async onCreateMessage(data: { text: string }) {
    await firstValueFrom(
      this.chatService.sendMessage(this.chat().id, data.text)
    )

    await firstValueFrom(this.chatService.getChatById(this.chat().id))

    this.updateGroupedMessages();
  }

}
