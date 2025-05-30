import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {SvgIconComponent} from "../../common-ui/svg-icon/svg-icon.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SvgIconComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form: FormGroup<{
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });


   onSubmit() {
     if (this.form.valid) {
       const formData = {
         username: this.form.value.username ?? '',
         password: this.form.value.password ?? ''
       };
       this.authService.login(formData).subscribe( async () => {
         await this.router.navigate(['']);
       });
     }
   }
}
