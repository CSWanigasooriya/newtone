import { ActivatedRoute, Router } from '@angular/router';
import { Cart, CartItem } from './../../../models/cart.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { Product, ProductVariant } from '../../../models/product.model';

import { Category } from './../../../models/category.model';
import { CollectionService } from '../../../services/collection.service';
import { NotificationService } from './../../../shared/services/notification.service';
import { Store } from '@ngrx/store';
import { postCart } from './../../../core/state/cart/cart.actions';

@Component({
  selector: 'newtone-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  activeIndex = 0;
  selectedColor = '';
  selectedSize = '';
  loadedVariants: Partial<ProductVariant>[] = [];
  images: string[] = [];
  product$!: Observable<Partial<Product> | undefined>;
  selectedId!: string | null | undefined;
  category$!: Observable<Partial<Category | undefined>>;

  private _subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _collection: CollectionService,
    private _notificationService: NotificationService,
    private _store: Store<{ cart: Cart }>
  ) {}

  handleAddToCart(product: Partial<Product>) {
    const variants = this.loadedVariants?.filter(
      (variant) =>
        variant.color === this.selectedColor &&
        variant.size === this.selectedSize
    );
    product.variants = variants.map((variant, index) => {
      return {
        ...variant,
        variantId: product.productId + index.toString(),
      };
    });

    const cartItem = {
      product,
    } as CartItem;
    this._store.dispatch(postCart({ item: cartItem }));
    this._notificationService.showNotification(
      `${product.name} added to cart successfully`
    );

    this.reset(product);
  }

  handleBuyNow(product: Partial<Product>) {
    const variants = this.loadedVariants?.filter(
      (variant) =>
        variant.color === this.selectedColor &&
        variant.size === this.selectedSize
    );
    product.variants = variants.map((variant, index) => {
      return {
        ...variant,
        variantId: product.productId + index.toString(),
      };
    });

    const cartItem = {
      product,
    } as CartItem;
    this._store.dispatch(postCart({ item: cartItem }));

    this._router.navigate(['/product/checkout']);
  }

  onColorChange(product: Partial<Product>) {
    const variants = product?.variants?.filter(
      (variant) => variant.color === this.selectedColor
    );
    product.variants = variants;
  }

  onSizeChange(product: Partial<Product>) {
    const variants = product?.variants?.filter(
      (variant) => variant.size === this.selectedSize
    );
    product.variants = variants;
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
        this.loadedVariants = product?.variants || [];

        this.category$ = this._collection.getCategory(
          product?.category?.categoryId || '0'
        );
        this.images =
          product?.variants?.map((variant) => variant.image || '') || [];
      })
    );
  }

  joinColorsAndSizes(
    variants: Partial<ProductVariant>[] | undefined,
    key: keyof ProductVariant
  ): string {
    return variants?.map((v) => v[key]).join(', ') || '';
  }

  reset(product: Partial<Product>) {
    this.selectedColor = '';
    this.selectedSize = '';
    this.product$ = this._collection.getProduct(product.productId || '0');
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

  getMinStock(variants: Partial<ProductVariant>[] | undefined) {
    return variants?.reduce((min, current) => {
      if (current.stock !== undefined) {
        return Math.min(min, current.stock);
      }
      return min;
    }, Number.MAX_SAFE_INTEGER);
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
