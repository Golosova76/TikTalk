import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, of, switchMap, tap } from 'rxjs';
import { ChatWorkspaceWrapperComponent } from './chat-workspace-wrapper/chat-workspace-wrapper.component';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { AsyncPipe } from '@angular/common';
import { chatsActions, selectActiveChat } from '@tt/data-access';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tt-chat-workspace',
  imports: [ChatWorkspaceWrapperComponent, ChatWorkspaceHeaderComponent, AsyncPipe],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  readonly activeChat$ = this.store.select(selectActiveChat);

  constructor() {
    this.route.params
      .pipe(
        switchMap(({ id }) => {
          if (id === 'new') {
            return this.route.queryParams.pipe(
              filter(({ userId }) => !!userId),
              tap(({ userId }) => {
                this.store.dispatch(chatsActions.createChat({ userId: Number(userId) }));
              })
            );
          }

          this.store.dispatch(chatsActions.loadChatById({ chatId: Number(id) }));

          return of(null);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
