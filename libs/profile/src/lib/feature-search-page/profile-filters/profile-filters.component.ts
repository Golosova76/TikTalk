import { Component, inject, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subscription } from 'rxjs';
import { profileActions } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-profile-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(Store);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(startWith({}), debounceTime(300))
      .subscribe((formValue): void => {
        this.store.dispatch(profileActions.filterEvents({ filters: formValue }));
      });
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
