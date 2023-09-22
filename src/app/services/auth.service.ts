import { Observable, of } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CollectionService } from './collection.service';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './../models/user.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<Partial<User> | null | undefined>;

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private collectionService: CollectionService,
    private afs: AngularFirestore
  ) {
    this.user$ = this.fireauth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          return this.afs
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
    return this.fireauth.signInWithEmailAndPassword(email, password);
  }

  //signup method
  signup(email: string, password: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password);
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
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        const user = {
          photoURL:  res.user?.photoURL ? res.user?.photoURL : '',
          uid: res.user?.uid ? res.user?.uid : '',
          email: res.user?.email ? res.user?.email : '',
        } as Partial<User>;
        this.collectionService.updateUser(user);
        this.router.navigate(['']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  signOut() {
    return this.fireauth.signOut();
  }
}

