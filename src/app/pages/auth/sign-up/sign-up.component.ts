import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'newtone-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signUpForm: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _auth: AuthService
  ) {}

  hide = true;
  mode$!: Observable<boolean>;

  handleSignUpSubmit() {
    if (!this.isPasswordMatch() || this.signUpForm.invalid) return;

    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    this._auth.signup(email, password);
  }

  signInWithGoogle() {
    this._auth.googleSignIn();
  }

  isSignUpValid() {
    return this.isPasswordMatch() && this.signUpForm.valid;
  }

  //Match passwords and confirm
  isPasswordMatch() {
    const password = this.signUpForm.value.password;
    const confirmPassword = this.signUpForm.value.confirmPassword;

    return password === confirmPassword;
  }

  signInForm() {
    this._router.navigate(['/auth']);
  }
}
