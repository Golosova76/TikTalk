import { AfterViewInit, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';
import { ProfileService } from '../../data/services/profile.service';
import { ProfileFiltersComponent } from './profile-filters/profile-filters.component';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements AfterViewInit {
  private readonly profileService = inject(ProfileService);
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);

  profiles = this.profileService.filteredProfiles;

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
