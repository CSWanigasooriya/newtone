import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'newtone-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  hidePassword = true;

  signInForm: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _auth: AuthService
  ) {}

  handleSignInSubmit() {
    if (this.signInForm.invalid) return;

    const email = this.signInForm.value.email;
    const password = this.signInForm.value.password;
    this._auth.signin(email, password);
  }

  signInWithGoogle() {
    this._auth.googleSignIn();
  }

  signUpForm() {
    this._router.navigate(['/auth/sign-up']);
  }
}
