import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { debounceTime, fromEvent } from 'rxjs';
import {
  profileActions,
  selectFilteredProfiles,
  selectProfilesHasNextPage,
  selectProfilesLoading,
  selectSubscriberIds,
} from '@tt/data-access';
import { Store } from '@ngrx/store';
import { LoadProfilesPageTriggerComponent } from '../../ui';

@Component({
  selector: 'tt-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent, LoadProfilesPageTriggerComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements AfterViewInit {
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);
  private readonly store = inject(Store);

  profiles = this.store.selectSignal(selectFilteredProfiles);

  subscriberIds = this.store.selectSignal(selectSubscriberIds);

  loading = this.store.selectSignal(selectProfilesLoading);

  hasNextPage = this.store.selectSignal(selectProfilesHasNextPage);

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  resizeFeed() {
    const feedElement = this.hostElement.nativeElement.querySelector('.scrollable-feed');
    if (!feedElement) return;

    const { top } = feedElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24;
    this.r2.setStyle(feedElement, 'height', `${height}px`);
  }

  timeToFetch() {
    if (this.loading()) return;

    if (!this.hasNextPage()) return;

    this.store.dispatch(profileActions.loadProfilesPage({}));
  }
}
