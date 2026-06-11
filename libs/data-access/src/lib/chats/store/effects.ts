import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Chat, ChatsService } from '../data';
import { chatsActions } from './actions';
import { Router } from '@angular/router';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { patchChatWithCurrentUser } from '../data/mapper/chat.mapper';
import { selectCurrentUserMe } from '../../current-user';

@Injectable({
  providedIn: 'root',
})
export class ChatEffects {
  private readonly chatService = inject(ChatsService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  actions$ = inject(Actions);

  loadMyChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.loadMyChats),
      switchMap(() => {
        return this.chatService.getMyChats().pipe(
          map((chats) => chatsActions.loadMyChatsSuccess({ chats })),
          catchError((error: unknown) => of(chatsActions.loadMyChatsFailure({ error })))
        );
      })
    );
  });

  createChat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.createChat),
      switchMap(({ userId }) => {
        return this.chatService.createChat(userId).pipe(
          map((chat: Chat) => chatsActions.createChatSuccess({ chat })),
          catchError((error: unknown) => of(chatsActions.createChatFailure({ error })))
        );
      })
    );
  });

  navigateAfterCreateChat$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(chatsActions.createChatSuccess),
        tap(({ chat }) => {
          this.router.navigate(['chats', chat.id]).then();
        })
      );
    },
    { dispatch: false }
  );

  refreshMyChatsAfterCreateChat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.createChatSuccess),
      map(() => chatsActions.loadMyChats())
    );
  });

  loadChatById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.loadChatById),
      concatLatestFrom(() => this.store.select(selectCurrentUserMe)),

      switchMap(([{ chatId }, me]) => {
        if (!me) {
          return of(chatsActions.loadChatByIdFailure({ error: new Error('Current user is not loaded') }));
        }

        return this.chatService.getChatById(chatId).pipe(
          map((chat: Chat) => {
            const chatView = patchChatWithCurrentUser(chat, me.id);
            return chatsActions.loadChatByIdSuccess({ chat: chatView });
          }),
          catchError((error: unknown) => of(chatsActions.loadChatByIdFailure({ error })))
        );
      })
    );
  });

  /**/
}
