import { Component, inject, input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { Router, RouterLink } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-profile-card',
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
