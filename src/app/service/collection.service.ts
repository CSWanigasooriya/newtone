import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore'

import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private usersCollection: AngularFirestoreCollection<Partial<User>>

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<Partial<User>>('users')
  }

  getUsers(): Observable<Partial<User>[]> {
    return this.usersCollection.valueChanges()
  }

  // async updateUser(user: Partial<User>) {
  //   return await this.usersCollection.doc(user.walletAddress).set(user, { merge: true })
  // }

  // getFiles() {
  //   return this.filesCollection.valueChanges()
  // }



  // async getNotifications(receiver: string) {
  //   const notifications = await this.chatNotificationCollection.ref
  //     .where('receiver', '==', receiver)
  //     .get()
  //   return notifications.docs.map((doc) => doc.data())
  // }

  // getReviews() {
  //   return this.reviewsCollection.valueChanges()
  // }

  // async getAverageReviewScore(fileId: number) {
  //   const reviews = await this.reviewsCollection.ref.where('id', '==', fileId).get()
  //   const reviewCount = reviews.docs.length
  //   const reviewScore = reviews.docs.reduce((acc, curr) => {
  //     return acc + (curr.data().rating ? Number(curr.data().rating) : 0)
  //   }, 0)
  //   return reviewScore / reviewCount
  // }

  // async updateFile(file: Partial<FileContract>) {
  //   return await this.filesCollection.doc().set(file, { merge: true })
  // }

  // async updateReview(review: Partial<ReviewContract>) {
  //   return await this.reviewsCollection.doc().set(review, { merge: true })
  // }
}
