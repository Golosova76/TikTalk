import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChatsService } from '../../../../chats/src/lib/data/services/chats.service';
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "@tt/profile";

@Component({
  selector: 'app-sidebar',
  imports: [SvgIconComponent, SubscriberCardComponent, AsyncPipe, RouterLink, RouterLinkActive, AvatarCircleComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly chatsService = inject(ChatsService);

  subscribers$ = this.profileService.getSubscribersShortList(5);

  me = this.profileService.me;

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
    this.chatsService.getMyChats().subscribe();
  }
}
