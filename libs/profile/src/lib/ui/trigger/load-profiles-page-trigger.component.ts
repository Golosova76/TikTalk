import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'tt-load-profiles-page-trigger',
  imports: [],
  templateUrl: './load-profiles-page-trigger.component.html',
  styleUrl: './load-profiles-page-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadProfilesPageTriggerComponent implements OnInit {
  loaded = output<void>();

  ngOnInit() {
    this.loaded.emit();
  }
}
