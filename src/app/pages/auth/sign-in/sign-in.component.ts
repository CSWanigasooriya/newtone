import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import { NotificationService } from './../../../shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'newtone-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signInForm: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _auth: AuthService,
    private _notificationService: NotificationService
  ) {}

  handleSignInSubmit() {
    if (this.signInForm.invalid) return;

    const email = this.signInForm.value.email;
    const password = this.signInForm.value.password;
    this._auth.signin(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this._router.navigate(['']);
      },
      (err) => {
        this._notificationService.showError({code:'1', message: 'something went wrong'})
        this._router.navigate(['/auth/sign-in']);
      }
    );
  }

  signInWithGoogle() {
    this._auth.googleSignIn();
  }

  signupForm(){
    this._router.navigate(['/sign-up']);
  }
}
