import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SvgIconComponent } from '@tt/common-ui';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'tt-login-page',
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form = new FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }>({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  onSubmit() {
    if (this.form.valid) {
      const formData = {
        username: this.form.value.username ?? '',
        password: this.form.value.password ?? '',
      };
      this.authService.login(formData).subscribe(async () => {
        await this.router.navigate(['']);
      });
    }
  }
}
