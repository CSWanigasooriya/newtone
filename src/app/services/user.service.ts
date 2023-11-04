import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user$: Observable<Partial<User> | undefined>;
  private usersCollection: AngularFirestoreCollection<Partial<User>>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.usersCollection = this.afs.collection<Partial<User>>('user');
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<Partial<User>>(`user/${user.uid}`).valueChanges();
        } else {
          return of(undefined);
        }
      })
    );
  }

  getCurrentUser(): Observable<Partial<User> | undefined> {
    return this.user$;
  }

  getUsers(): Observable<Partial<User>[]> {
    return this.usersCollection.valueChanges();
  }

  // async updateUser(user: Partial<User>) {
  //   return await this.usersCollection.doc(user.uid).set(user, { merge: true });
  // }

  async updateUser(user: Partial<User> | null) {
    return this.usersCollection.doc(user?.userId).set(
      {
        ...user,
      },
      { merge: true }
    );
  }

  // updateUser(uid: string): Observable<Partial<User> | undefined> {
  //   return this.usersCollection.doc<Partial<User>>(pid).valueChanges();
  // }
}
