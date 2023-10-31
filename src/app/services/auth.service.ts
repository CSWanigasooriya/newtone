import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ERROR_CONFIG, ErrorConfig } from '../core/config/error.config';
import { NotificationService } from '../shared/services/notification.service';
import { Role, User } from './../models/user.model';
import { CollectionService } from './collection.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<Partial<User> | null | undefined>;
  BACKEND_URL = 'http://localhost:3000';

  constructor(
    private _fireAuth: AngularFireAuth,
    private _router: Router,
    private _collection: CollectionService,
    private _afs: AngularFirestore,
    private _notificationService: NotificationService,
    private _http: HttpClient,
    @Inject(ERROR_CONFIG) public errorConfig: ErrorConfig
  ) {
    this.user$ = this._fireAuth.authState.pipe(
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
  async signin(email: string, password: string) {
    try {
      const credential = await this._fireAuth.signInWithEmailAndPassword(
        this._mapEmail(email),
        password
      );

      const idToken = await credential.user
        ?.getIdTokenResult(true)
        .then((res) => res.token)
        .catch((err) => console.log(err));

      const claims = await credential.user?.getIdTokenResult(true).then(
        (res) => res.claims || {},
        (err) => console.log(err)
      );

      const userRole =
        Object.keys(claims || {}).find((key) => {
          const role = Role[key as keyof typeof Role];
          return role && claims?.[role];
        }) ?? Role.user;

      // if (idToken) {
      //   (await this.setAdminClaim(idToken)).subscribe((res: unknown) =>
      //     console.log(res)
      //   );
      // }

      const user = {
        photoURL: credential.user?.photoURL ?? '',
        userId: credential.user?.uid ?? '',
        email: credential.user?.email ?? '',
        idToken: idToken ?? '',
        role: userRole ?? '',
      } as Partial<User> | null;

      if (user) {
        this._collection.updateUser(user);
        userRole === Role.admin
          ? this._router.navigate(['/admin'])
          : this._router.navigate(['']);
      }
    } catch (err) {
      this._notificationService.showNotification('error');
    }
  }

  //signup method
  async signup(email: string, password: string) {
    try {
      const credential = await this._fireAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      const idToken = await credential.user
        ?.getIdTokenResult(true)
        .then((res) => res.token)
        .catch((err) => console.log(err));

      const user = {
        photoURL: credential.user?.photoURL ?? '',
        userId: credential.user?.uid ?? '',
        email: credential.user?.email ?? '',
        idToken: idToken ?? '',
      } as Partial<User> | null;

      if (user) {
        this._collection.updateUser(user);
        this._router.navigate(['']);
      }
    } catch (err) {
      this._notificationService.showNotification('error');
    }
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
  async googleSignIn() {
    try {
      const credential = await this._fireAuth.signInWithPopup(
        new GoogleAuthProvider()
      );

      const idToken = await credential.user
        ?.getIdTokenResult(true)
        .then((res) => res.token)
        .catch((err) => console.log(err));

      const claims = await credential.user?.getIdTokenResult(true).then(
        (res) => res.claims || {},
        (err) => console.log(err)
      );

      const userRole =
        Object.keys(claims || {}).find((key) => {
          const role = Role[key as keyof typeof Role];
          return role && claims?.[role];
        }) ?? Role.user;

      const user = {
        photoURL: credential.user?.photoURL ?? '',
        userId: credential.user?.uid ?? '',
        email: credential.user?.email ?? '',
        idToken: idToken ?? '',
        role: userRole ?? '',
      } as Partial<User> | null;

      if (user) {
        this._collection.updateUser(user);
        userRole === Role.admin
          ? this._router.navigate(['/admin'])
          : this._router.navigate(['']);
      }
    } catch (err) {
      this._notificationService.showNotification('error');
    }
  }

  signOut() {
    this._router.navigate(['/auth']);
    return this._fireAuth.signOut();
  }

  private async _setAdminClaim(idToken: string): Promise<Observable<object>> {
    return this.post('setAdminClaim', { idToken });
  }

  private _mapEmail(email: string) {
    const regex = '^[A-Z0-9@. _%+-]{6,254}$';
    const username = email.split('@')[0];

    if (username.match(regex)) {
      return email;
    } else {
      return `${username}@gmail.com`;
    }
  }

  get(uri: string): Observable<object> {
    return this._http.get(`${this.BACKEND_URL}/${uri}`);
  }

  post(uri: string, payload: object): Observable<object> {
    return this._http.post(`${this.BACKEND_URL}/${uri}`, payload);
  }

  put(uri: string, payload: object): Observable<object> {
    return this._http.put(`${this.BACKEND_URL}/${uri}`, payload);
  }

  delete(uri: string, payload: object): Observable<object> {
    return this._http.delete(`${this.BACKEND_URL}/${uri}`, payload);
  }
}
