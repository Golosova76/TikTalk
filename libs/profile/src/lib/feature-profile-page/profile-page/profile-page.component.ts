import { Component, inject, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { PostFeedComponent } from '@tt/posts';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { ProfileHeaderComponent } from '../../ui';
import {
  ProfileService,
  selectCurrentUserMe,
  selectSubscribersShortList
} from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-profile-page',
  imports: [ProfileHeaderComponent, AsyncPipe, SvgIconComponent, RouterLink, PostFeedComponent, AvatarCircleComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  private readonly profileService = inject(ProfileService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  readonly me = this.store.selectSignal(selectCurrentUserMe);

  me$ = toObservable(this.me);

  readonly subscribers = this.store.selectSignal(selectSubscribersShortList(5))

  isMyPage = signal(false);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.me()?.id);
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    await this.router.navigate(['/chats', 'new'], { queryParams: { userId: userId } });
  }
}
