import { Component, inject, signal } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ChatsService } from '../../data/services/chats.service';
import {PostFeedComponent} from "@tt/posts";
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "@tt/profile";


@Component({
  selector: 'app-profile-page',
  imports: [ProfileHeaderComponent, AsyncPipe, SvgIconComponent, RouterLink, PostFeedComponent, AvatarCircleComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  private readonly profileService = inject(ProfileService);
  private readonly chatsService = inject(ChatsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  me$ = toObservable(this.profileService.me);

  subscribers$ = this.profileService.getSubscribersShortList(5);

  isMyPage = signal(false);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    const res = await firstValueFrom(this.chatsService.createChat(userId));
    await this.router.navigate(['/chats', res.id]);
  }
}
