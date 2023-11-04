import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { serverTimestamp } from '@angular/fire/firestore';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsCollection: AngularFirestoreCollection<Partial<Review>>;

  constructor(private afs: AngularFirestore) {
    this.reviewsCollection = this.afs.collection<Partial<Review>>('reviews');
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
      .collection<Partial<Review>>('reviews', (ref) =>
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
}
