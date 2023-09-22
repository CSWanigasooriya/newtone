import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<Partial<User>>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<Partial<User>>('users');
  }

  getUsers(): Observable<Partial<User>[]> {
    return this.usersCollection.valueChanges();
  }

  // async updateUser(user: Partial<User>) {
  //   return await this.usersCollection.doc(user.uid).set(user, { merge: true });
  // }

  async updateUser(user: Partial<User> | null) {
    return this.afs
      .collection('users')
      .doc(user?.uid)
      .set(
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
