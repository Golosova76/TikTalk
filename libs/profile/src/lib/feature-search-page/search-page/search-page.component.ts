import { AfterViewInit, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { debounceTime, fromEvent } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {ProfileService} from "../../data/services/profile.service";

@Component({
  selector: 'tt-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements AfterViewInit {
  private readonly profileService = inject(ProfileService);
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);

  profiles = this.profileService.filteredProfiles;

  subscriberIds = toSignal(this.profileService.getSubscribersIds(), {
    initialValue: new Set<number>(),
  });

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
}
