import {Component, effect, inject, ViewChild} from '@angular/core';
import {ProfileHeaderComponent} from "../../common-ui/profile-header/profile-header.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {SvgIconComponent} from "../../common-ui/svg-icon/svg-icon.component";
import {ProfileService} from "../../data/services/profile.service";
import {firstValueFrom} from "rxjs";
import {AvatarUploadComponent} from "./avatar-upload/avatar-upload.component";
import {toObservable} from "@angular/core/rxjs-interop";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    AvatarUploadComponent,
    AsyncPipe,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})

export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  profile$ = toObservable(this.profileService.me);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value: '', disabled: true}, Validators.required],
    description: [''],
    stack: [''],
  })

  constructor() {
    effect(() => {
      this.form.patchValue({
        ...this.profileService.me(),
        stack: this.mergeStack(this.profileService.me()?.stack)
      })
    });
  }


  async onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return

    if (this.avatarUploader.avatar) {
      await firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar))
    }


    // Преобразуем значения формы, заменяя null на undefined
    const formValue = {
      ...this.form.value,
      stack: this.splitStack(this.form.value.stack)
    };

    const cleanedValue = Object.fromEntries(
      Object.entries(formValue)
        .map(([key, value]) => [key, value === null ? undefined : value])
    );

    await firstValueFrom(this.profileService.patchProfile(cleanedValue));
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return []
    if (Array.isArray(stack)) return stack

    return stack.split(',')
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return ''
    if (Array.isArray(stack)) return stack.join(',')

    return stack;
  }

}
