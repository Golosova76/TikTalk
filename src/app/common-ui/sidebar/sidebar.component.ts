import {Component, inject, OnInit} from '@angular/core';
import {SvgIconComponent} from "../svg-icon/svg-icon.component";
import {AsyncPipe, NgForOf} from "@angular/common";
import {SubscriberCardComponent} from "./subscriber-card/subscriber-card.component";
import {ProfileService} from "../../data/services/profile.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AvatarCircleComponent} from "../avatar-circle/avatar-circle.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgForOf,
    SubscriberCardComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    AvatarCircleComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService)

  subscribers$ = this.profileService.getSubscribersShortList(5);

  me = this.profileService.me

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
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    }
  ]

  ngOnInit() {
    this.profileService.getMe().subscribe();
  }
}
