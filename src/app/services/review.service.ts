import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { serverTimestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsCollection: AngularFirestoreCollection<Partial<Review>>;

  constructor(private afs: AngularFirestore) {
    this.reviewsCollection = this.afs.collection<Partial<Review>>('review');
  }

  addReview(review: Partial<Review>): Promise<void> {
    const id = this.afs.createId();
    return this.reviewsCollection.doc(id).set(
      {
        ...review,
        createdAt: serverTimestamp(),
        reviewId: id,
      },
      { merge: true }
    );
  }

  getReviewsByProduct(productId: string): Observable<Partial<Review>[]> {
    return this.afs
      .collection<Partial<Review>>('review', (ref) =>
        ref.where('productId', '==', productId)
      )
      .valueChanges();
  }

  getReviewsByUser(userId: string): Observable<Partial<Review>[]> {
    return this.afs
      .collection<Partial<Review>>('review', (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges();
  }

  updateReview(reviewId: string, review: Partial<Review>): Promise<void> {
    return this.reviewsCollection
      .doc(reviewId)
      .set({ ...review }, { merge: true });
  }

  deleteReview(reviewId: string): Promise<void> {
    return this.reviewsCollection.doc(reviewId).delete();
  }
  
  async deleteReviews(reviewIds: string[]) {
    const batch = this.afs.firestore.batch();
    reviewIds.forEach((reviewId) => {
      const docRef = this.reviewsCollection.doc(reviewId).ref;
      batch.delete(docRef);
    });
    return await batch.commit();
  }

  getReview(reviewId: string): Observable<Partial<Review> | undefined> {
    return this.reviewsCollection.doc<Partial<Review>>(reviewId).valueChanges();
  }

  getReviews() {
    return this.reviewsCollection.valueChanges();
  }
}
