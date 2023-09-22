import { Observable, of } from 'rxjs';

import { Inject, Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ERROR_CONFIG, ErrorConfig } from '../core/config/error.config';
import { NotificationService } from '../shared/services/notification.service';
import { User } from './../models/user.model';
import { CollectionService } from './collection.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<Partial<User> | null | undefined>;

  constructor(
    private _fireauth: AngularFireAuth,
    private _router: Router,
    private _collection: CollectionService,
    private _afs: AngularFirestore,
    private _notificationService: NotificationService,
    @Inject(ERROR_CONFIG) public errorConfig: ErrorConfig
  ) {
    this.user$ = this._fireauth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          return this._afs
            .doc<Partial<User>>(`users/${user.uid}`)
            .valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  //signin method
  signin(email: string, password: string) {
    return this._fireauth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        const user = {
          photoURL: res.user?.photoURL ?? '',
          uid: res.user?.uid ?? '',
          email: res.user?.email ?? '',
        } as Partial<User>;

        this._collection.updateUser(user);
        this._router.navigate(['']);
      })
      .catch((err) => {
        this._notificationService.showError(err);
      });
  }

  //signup method
  signup(email: string, password: string) {
    return this._fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        const user = {
          photoURL: res.user?.photoURL ?? '',
          uid: res.user?.uid ?? '',
          email: res.user?.email ?? '',
        } as Partial<User>;

        this._collection.updateUser(user);
        this._router.navigate(['']);
      },
      (err) => {
        this._notificationService.showError(err);
      }
    );
  }

  // //forgot password
  // forgotPassword(email: string) {
  //   this.fireauth.sendPasswordResetEmail(email).then(
  //     () => {
  //       this.router.navigate(['/auth/forgot-password']);
  //     },
  //     (err) => {
  //       alert('Something went wrong');
  //     }
  //   );
  // }

  // //email verification
  // sendEmailForVerification(user: any) {
  //   user.sendEmailVerification().then(
  //     (res: any) => {
  //       this.router.navigate(['/auth/verify-email']);
  //     },
  //     (err: any) => {
  //       alert('Something went wrong, Not able to send the E-mail to verify');
  //     }
  //   );
  // }

  //sign in with google
  googleSignIn() {
    return this._fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        const user = {
          photoURL: res.user?.photoURL ?? '',
          uid: res.user?.uid ?? '',
          email: res.user?.email ?? '',
        } as Partial<User>;

        this._collection.updateUser(user);
        this._router.navigate(['']);
      },
      (err) => {
        this._notificationService.showError(err);
      }
    );
  }

  signOut() {
    this._router.navigate(['/auth']);
    return this._fireauth.signOut();
  }
}
