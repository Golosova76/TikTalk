import { Component, inject, OnInit } from '@angular/core';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import {
  currentUserActions, profileActions,
  selectCurrentUserMe,
  selectSubscribersShortList,
  selectUnreadMessagesCount
} from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-sidebar',
  imports: [SvgIconComponent, SubscriberCardComponent, RouterLink, RouterLinkActive, AvatarCircleComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private readonly store = inject(Store);

  readonly me = this.store.selectSignal(selectCurrentUserMe);

  readonly subscribers = this.store.selectSignal(selectSubscribersShortList(5));
  readonly unreadMessagesCount = this.store.selectSignal(selectUnreadMessagesCount);

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
    this.store.dispatch(currentUserActions.loadMe());
    this.store.dispatch(profileActions.loadSubscribers());
  }
}
