import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatsService } from '../../data/services/chats.service';
import { filter, of, switchMap } from 'rxjs';
import { ChatWorkspaceWrapperComponent } from './chat-workspace-wrapper/chat-workspace-wrapper.component';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'tt-chat-workspace',
  imports: [ChatWorkspaceWrapperComponent, ChatWorkspaceHeaderComponent, AsyncPipe],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly chatsService = inject(ChatsService);

  activeChat$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'new') {
        return this.route.queryParams.pipe(
          filter(({ userId }) => userId),
          switchMap(({ userId }) => {
            return this.chatsService.createChat(userId).pipe(
              switchMap((chat) => {
                this.router.navigate(['chats', chat.id]).then();
                return of(null);
              })
            );
          })
        );
      }

      return this.chatsService.getChatById(id);
    })
  );
}
