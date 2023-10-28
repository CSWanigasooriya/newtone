import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { Cart } from './../../../models/cart.model';
import { Category } from './../../../models/category.model';
import { CollectionService } from '../../../services/collection.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { Product } from '../../../models/product.model';
import { Store } from '@ngrx/store';
import { postCart } from './../../../core/state/cart/cart.actions';

@Component({
  selector: 'newtone-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  activeIndex = 0;
  images: string[] = [];
  product$!: Observable<Partial<Product> | undefined>;
  selectedId!: string | null | undefined;
  category$!: Observable<Partial<Category | undefined>>;

  private _subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private _collection: CollectionService,
    private _notificationService: NotificationService,
    private _store: Store<{ cart: Cart }>,
  ) {}

  handleAddToCart(product: Partial<Product>) {
    if (product.categoryId === undefined || product.categoryId === null) return;
    this._store.dispatch(postCart({ products: product }));
    this._notificationService.showNotification(
      `${product.name} added to cart successfully`
    );
  }

  ngOnInit() {
    this.showSlide(this.activeIndex);

    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = params.get('id')?.trim();
        return this._collection.getProduct(this.selectedId || '0');
      })
    );
    this._subscriptions.add(
      this.product$.subscribe((product) => {
        this.category$ = this._collection.getCategory(
          product?.categoryId || '0'
        );
        this.images = product?.imageURLs || [];
      })
    );
  }

  showSlide(index: number): void {
    this.activeIndex = index;
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.activeIndex =
      (this.activeIndex - 1 + this.images.length) % this.images.length;
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
