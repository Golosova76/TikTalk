import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { PostInputComponent } from '../../../profile-page/post-input/post-input.component';
import { ChatsService } from '../../../../data/services/chats.service';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { Chat, MessageGroup } from '../../../../data/interfaces/chats.interface';
import { debounceTime, firstValueFrom, fromEvent, Subject, takeUntil } from 'rxjs';
import { MessageGroupDateService } from '../../../../data/services/message-group-date.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-workspace-wrapper',
  imports: [PostInputComponent, ChatWorkspaceMessageComponent],
  templateUrl: './chat-workspace-wrapper.component.html',
  styleUrl: './chat-workspace-wrapper.component.scss',
})
export class ChatWorkspaceWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly chatService = inject(ChatsService);
  private readonly messageGroupDateService = inject(MessageGroupDateService);
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);
  private destroy$ = new Subject<void>();
  private previousChatId: number | null = null;

  chat = input.required<Chat>();

  groupMessages = signal<MessageGroup[]>([]);

  messages = this.chatService.activeChatMessages;
  messages$ = toObservable(this.messages);

  constructor() {
    effect(() => {
      const currentChatId = this.chat().id;
      if (this.previousChatId === currentChatId) return;
      this.previousChatId = currentChatId;
      this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    this.messages$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateGroupedMessages();
    });
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  resizeFeed() {
    const feedElement = this.hostElement.nativeElement.querySelector('.scrollable-chat');
    if (!feedElement) return;

    const { top } = feedElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24;
    this.r2.setStyle(feedElement, 'height', `${height}px`);
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
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, data.text));
    await firstValueFrom(this.chatService.getChatById(this.chat().id));

    await firstValueFrom(this.chatService.getMyChats());

    this.scrollToBottom();

    this.chatService.getMyChats().subscribe();
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const feedElement = this.hostElement.nativeElement.querySelector('.scrollable-chat');

      if (!feedElement) return;

      feedElement.scrollTop = feedElement.scrollHeight;
    });
  }
}
