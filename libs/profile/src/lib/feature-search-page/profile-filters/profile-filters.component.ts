import { Component, inject, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subscription } from 'rxjs';
import { profileActions, selectProfileFiltersForm } from '@tt/data-access';
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

  readonly profileFiltersFormStore = this.store.selectSignal(selectProfileFiltersForm);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;

  constructor() {
    this.searchForm.setValue(this.profileFiltersFormStore(), { emitEvent: false });
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(startWith(this.searchForm.getRawValue()), debounceTime(300))
      .subscribe((): void => {
        this.store.dispatch(profileActions.filterEvents({ filtersForm: this.searchForm.getRawValue() }));
      });
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
