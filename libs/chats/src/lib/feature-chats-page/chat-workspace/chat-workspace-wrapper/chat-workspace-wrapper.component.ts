import {
  AfterViewInit, ChangeDetectionStrategy,
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
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';
import { PostInputComponent } from '@tt/posts';
import {
  chatsActions,
  MessageGroup,
  MessageGroupDateService,
  MessageView,
  selectActiveChatMessages
} from '@tt/data-access';
import { ChatView } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-chat-workspace-wrapper',
  imports: [PostInputComponent, ChatWorkspaceMessageComponent],
  templateUrl: './chat-workspace-wrapper.component.html',
  styleUrl: './chat-workspace-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly messageGroupDateService = inject(MessageGroupDateService);
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);
  private readonly store = inject(Store);

  private destroy$ = new Subject<void>();
  private previousChatId: number | null = null;

  chat = input.required<ChatView>();

  groupMessages = signal<MessageGroup[]>([]);

  readonly messages$ = this.store.select(selectActiveChatMessages);

  constructor() {
    effect(() => {
      const currentChatId = this.chat().id;
      if (this.previousChatId === currentChatId) return;
      this.previousChatId = currentChatId;
      this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    this.messages$.pipe(takeUntil(this.destroy$)).subscribe(( messages) => {
      this.updateGroupedMessages(messages);
      this.scrollToBottom();
    });
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntil(this.destroy$))
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

  updateGroupedMessages(messages: MessageView[]): void {
    const grouped = this.messageGroupDateService.groupMessagesByDate(messages);
    this.groupMessages.set(grouped);
  }

  onCreateMessage(data: { text: string }) {
    //this.store.dispatch(chatsActions.sendMessage({ chatId: this.chat().id, text: data.text }));
    this.store.dispatch(chatsActions.wsSendMessage({ chatId: this.chat().id, text: data.text }));
  }
/*
  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const feedElement = this.hostElement.nativeElement.querySelector('.scrollable-chat');

      if (!feedElement) return;

      feedElement.scrollTop = feedElement.scrollHeight;
    });
  }
*/
  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const feedElement = this.hostElement.nativeElement.querySelector('.scrollable-chat');

        if (!feedElement) return;

        feedElement.scrollTop = feedElement.scrollHeight;
      });
    });
  }
}
