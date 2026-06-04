import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AvatarUploadComponent } from '../../ui';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@tt/auth';
import { SvgIconComponent } from '@tt/common-ui';
import { Profile, ProfileService } from '@tt/data-access';
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
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
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
    stack: [''],
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        ...this.me(),
        stack: this.mergeStack(this.me()?.stack),
      });
    });
  }

  async onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      await firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar));
    }

    const formValue = this.form.getRawValue();

    const profile: Partial<Profile> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      description: formValue.description,
      stack: this.splitStack(formValue.stack),
    };

    this.store.dispatch(currentUserActions.patchMe({ profile: profile }));
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }

  onUndo(): void {
    const profile = this.me();

    this.form.patchValue({
      ...profile,
      stack: this.mergeStack(profile?.stack),
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
