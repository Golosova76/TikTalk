import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, EMPTY, exhaustMap, filter, map, mergeMap, of, switchMap, take, tap, timer} from 'rxjs';
import { Chat, ChatsService } from '../data';
import { chatsActions } from './actions';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { patchChatWithCurrentUser } from '../data/mapper/chat.mapper';
import { selectCurrentUserMe } from '../../current-user';
import { Profile } from '../../profile/data';
import {isWSErrorMessage, isWSNewMessage, isWSUnreadMessage} from "../data/interfaces/chats-websocket.interface";
import {selectWsConnectionStatus, selectWsShouldReconnect} from "./selectors";
import {concatLatestFrom} from "@ngrx/operators";

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

      switchMap(({ chatId }) => {
        return this.store.select(selectCurrentUserMe).pipe(
          filter((me): me is Profile => me !== null),
          take(1),

          switchMap((me) => {
            return this.chatService.getChatById(chatId).pipe(
              map((chat: Chat) => {
                const chatView = patchChatWithCurrentUser(chat, me.id);
                return chatsActions.loadChatByIdSuccess({ chat: chatView });
              }),
              catchError((error: unknown) => of(chatsActions.loadChatByIdFailure({ error })))
            );
          })
        );
      })
    );
  });

  connectWs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.wsConnect),
      exhaustMap(() => {
        return this.chatService.connectWs({
          onOpen: () => this.store.dispatch(chatsActions.wsConnected()),
          onClose: (event) => {
            this.store.dispatch(
              chatsActions.wsDisconnected({
                closeInfo: {
                  code: event.code,
                  reason: event.reason,
                  wasClean: event.wasClean,
                },
              })
            );
          },
        }).pipe(
          map(( message ) => {
            if (isWSErrorMessage(message)) {
              return chatsActions.wsErrorReceived({ error: message.message });
            }
            if (isWSUnreadMessage(message)) {
              return chatsActions.wsUnreadReceived({ count: message.data.count });
            }
            if (isWSNewMessage(message)) {
              return chatsActions.wsNewMessageReceived({ message });
            }
            return chatsActions.wsErrorReceived({
              error: 'Unknown websocket message',
            });
          }),
          catchError((error: unknown) => of(chatsActions.wsConnectFailure({ error }))
          )
        );
      })
    );
  });

  refreshMyChatsAfterWsNewMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.wsNewMessageReceived),
      map(() => chatsActions.loadMyChats())
    );
  });

  sendWsMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.wsSendMessage),
      concatLatestFrom(() => this.store.select(selectWsConnectionStatus)),
      mergeMap(([{ chatId, text }, status]) => {
        if (status !== 'connected') {
          return of(
            chatsActions.wsErrorReceived({
              error: 'WebSocket is not connected',
            })
          );
        }

        this.chatService.sendWsMessage(text, chatId);
        return EMPTY;
      })
    );
  });

  disconnectWs$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(chatsActions.wsDisconnect),
        tap(() => {
          this.chatService.disconnectWs();
        })
      );
    },
    { dispatch: false }
  );

  reconnectWs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.wsDisconnected, chatsActions.wsConnectFailure),
      switchMap(() => {
        return this.store.select(selectWsShouldReconnect).pipe(
          take(1),
          filter(Boolean),
          switchMap(() => {
            return timer(3000).pipe(
              map(() => chatsActions.wsReconnect())
            );
          })
        );
      })
    );
  });

  connectAfterReconnect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(chatsActions.wsReconnect),
      map(() => chatsActions.wsConnect())
    );
  });

  /**/
}
