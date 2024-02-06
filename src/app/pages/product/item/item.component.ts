import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { APP_CONFIG, AppConfig } from './../../../core/config/app.config';
import { CollectionService } from './../../../services/collection.service';

import { Subscription } from 'rxjs';
import { Product, ProductVariant } from '../../../models/product.model';

@Component({
  selector: 'newtone-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnChanges, OnDestroy {
  @Input() product: Partial<Product> = {};
  @Output() addToCart: EventEmitter<Product> = new EventEmitter();
  averageRating = -1;

  private subscriptions = new Subscription();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private _collectionService: CollectionService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue) {
      this.setAverageRating(changes['product'].currentValue.id);
    }
  }

  setAverageRating(productId: string) {
    this.subscriptions.add(
      this._collectionService
        .getReviewsByProduct(productId)
        .subscribe((reviews) => {
          // Calculate the sum of all valid ratings
          const sumOfRatings = reviews.reduce((total, review) => {
            // Check if review.rating exists and is not null/undefined before adding
            if (review.rating != null) {
              return total + review.rating;
            } else {
              return total;
            }
          }, 0);

          // Calculate the number of valid reviews (excluding null or undefined ratings)
          const numberOfValidReviews = reviews.filter(
            (review) => review.rating != null
          ).length;

          // Calculate the average rating
          this.averageRating =
            numberOfValidReviews > 0 ? sumOfRatings / numberOfValidReviews : 0;
        })
    );
  }

  handleAddToCart(product: Partial<Product>) {
    this.addToCart.emit(product as Product);
  }

  getMinStock(variants: Partial<ProductVariant>[] | undefined) {
    return variants?.reduce((min, current) => {
      if (current.stock !== undefined) {
        return Math.min(min, current.stock);
      }
      return min;
    }, Number.MAX_SAFE_INTEGER);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
