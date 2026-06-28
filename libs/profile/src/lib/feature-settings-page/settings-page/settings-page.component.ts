import { ChangeDetectionStrategy, Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarUploadComponent, StackCustomControlComponent } from '../../ui';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@tt/auth';
import { SvgIconComponent } from '@tt/common-ui';
import { Profile } from '@tt/data-access';
import { Store } from '@ngrx/store';
import { currentUserActions, selectCurrentUserMe } from '@tt/data-access';
import { ProfileHeaderComponent } from '../../ui';

@Component({
  selector: 'tt-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    AvatarUploadComponent,
    AsyncPipe,
    RouterLink,
    StackCustomControlComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);

  readonly me = this.store.selectSignal(selectCurrentUserMe);
  readonly profile$ = this.store.select(selectCurrentUserMe);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    //stack: this.fb.nonNullable.control<string[]>([]),
    stack: [[] as string[]],
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        ...this.me(),
        stack: this.me()?.stack ?? [],
      });
    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const profile: Partial<Profile> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      description: formValue.description,
      stack: formValue.stack,
    };

    this.store.dispatch(currentUserActions.saveSettings({ profile, avatar: this.avatarUploader.avatar ?? null }));
  }

  onUndo(): void {
    const profile = this.me();

    this.form.patchValue({
      ...profile,
      stack: profile?.stack ?? [],
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
