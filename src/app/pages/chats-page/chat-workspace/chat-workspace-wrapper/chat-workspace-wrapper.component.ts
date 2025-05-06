import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {PostInputComponent} from "../../../profile-page/post-input/post-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {ChatWorkspaceMessageComponent} from "./chat-workspace-message/chat-workspace-message.component";
import {Chat, MessageGroup} from "../../../../data/interfaces/chats.interface";
import {firstValueFrom, Subject, takeUntil} from "rxjs";
import {MessageGroupDateService} from "../../../../data/services/message-group-date.service";
import {toObservable} from "@angular/core/rxjs-interop";

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
export class ChatWorkspaceWrapperComponent implements OnInit, OnDestroy {
  chatService = inject(ChatsService);
  messageGroupDateService = inject(MessageGroupDateService);

  chat = input.required<Chat>();

  groupMessages = signal<MessageGroup[]>([])

  messages = this.chatService.activeChatMessages;
  messages$ = toObservable(this.messages);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.messages$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateGroupedMessages();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    await firstValueFrom(this.chatService.getChatById(this.chat().id));

    await firstValueFrom(this.chatService.getMyChats());

    this.chatService.getMyChats().subscribe();
  }
}
