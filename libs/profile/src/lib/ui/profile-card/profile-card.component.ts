import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {Profile} from "@tt/interfaces/profile";

@Component({
  selector: 'tt-profile-card',
  imports: [ImgUrlPipe, RouterLink, SvgIconComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  profile = input.required<Profile>();
  isSubscriber = input(false);

  private readonly router = inject(Router);

  openChat(userId: number) {
    this.router.navigate(['/chats', userId]).then();
  }

  onSubscribe() {
    console.log('Подписаться на пользователя:', this.profile().id);
  }
}
