import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { ChatsService } from '@tt/chats';
import { currentUserActions, ProfileService, selectCurrentUserMe } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-sidebar',
  imports: [SvgIconComponent, SubscriberCardComponent, AsyncPipe, RouterLink, RouterLinkActive, AvatarCircleComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly chatsService = inject(ChatsService);
  private readonly store = inject(Store);

  readonly me = this.store.selectSignal(selectCurrentUserMe);

  subscribers$ = this.profileService.getSubscribersShortList(5);

  readonly unreadMessagesCount = this.chatsService.unreadMessagesCount;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
      showUnreadBadge: true,
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit() {
    this.profileService.getMe().subscribe();
    this.store.dispatch(currentUserActions.loadMe());
    this.chatsService.getMyChats().subscribe();
  }
}
