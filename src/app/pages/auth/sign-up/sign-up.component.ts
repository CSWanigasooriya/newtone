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
    if (this.signUpForm.invalid) return;

    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    this._auth.signup(email, password).then(
      () => {
        alert('registration successful');
        this._router.navigate(['']);
      },
      (err) => {
        alert(err.messsage);
        this._router.navigate(['/sign-up']);
      }
    );
  }

  signInWithGoogle() {
    this._auth.googleSignIn();
  }

  isSignUpValid() {
    return !this.checkPasswords() && this.signUpForm.valid
  }

    //Match passwords and confirm
    checkPasswords() {
      const pass = this.signUpForm.value.password;
      const confirmPass = this.signUpForm.value.confirmPassword;

      return pass === confirmPass ? null : { notSame: true }
    }

      //Custom error messages fot mat-hints
      signUpPasswordErrorMessage(): string {
        if (this.checkPasswords()) {
          return 'Passwords do not match'
        } else {
          return ''
        }
      }

  signinForm(){
    this._router.navigate(['/auth']);
  }
}

