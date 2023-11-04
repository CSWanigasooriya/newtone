import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map, switchMap, tap } from 'rxjs';

import { CollectionService } from './../../../services/collection.service';
import { Review } from './../../../models/review.model';
import { User } from './../../../models/user.model';

@Component({
  selector: 'newtone-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, OnDestroy {
  @Input() productId: string | undefined;

  reviews: Partial<Review>[] = [];
  currentUser: Partial<User> | undefined;

  newReview: Partial<Review> = {
    reviewId: '',
    user: {},
    comment: '',
    rating: 0,
  };

  private _subscription = new Subscription();
  constructor(private _collection: CollectionService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this._subscription.add(
      this._collection
        .getReviewsByProduct(this.productId || '')
        .pipe(
          switchMap((reviews) =>
            this._collection.getCurrentUser().pipe(
              tap((user) => (this.currentUser = user)),
              map((user) => ({
                reviews: reviews.map((review) => ({
                  ...review,
                  user: {
                    ...review.user,
                    userId: review.user?.userId || user?.userId,  
                  },
                })),
              }))
            )
          )
        )
        .subscribe((result) => {
          this.reviews = result?.reviews;
        })
    );
  }

  addReview() {
    if (this.productId && this.newReview.comment && this.newReview.rating) {
      this.newReview = {
        ...this.newReview,
        productId: this.productId,
      };
      this._collection.createReview(this.newReview).then(() => {
        this.loadReviews(); // Refresh the reviews after adding a new one
        this.newReview = {
          reviewId: '',
          user: {},
          comment: '',
          rating: 0,
        };
      });
    }
  }

  deleteReview(reviewId: string | undefined) {
    if (!reviewId) return;
    this._collection.deleteReview(reviewId).then(() => {
      this.loadReviews(); // Refresh the reviews after deleting one
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
