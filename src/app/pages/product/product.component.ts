import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, map, startWith } from 'rxjs';

import { Cart } from './../../models/cart.model';
import { CollectionService } from '../../services/collection.service';
import { FormControl } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { NotificationService } from './../../shared/services/notification.service';
import { Product } from './../../models/product.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { postCart } from './../../core/state/cart/cart.actions';

@Component({
  selector: 'newtone-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnDestroy {
  cart$: Observable<Cart>;
  openDropdown = false;
  breadCrumb = ['HOME', 'PRODUCT'];
  searchControl = new FormControl('');
  products$ = this._collection.getProducts();
  filteredProducts!: Observable<Partial<Product>[]>;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  private _subscriptions = new Subscription();

  constructor(
    private _collection: CollectionService,
    private _router: Router,
    private _notificationService: NotificationService,
    private _store: Store<{ cart: Cart }>,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.cart$ = this._store.select('cart');

    this.products$.subscribe((products) => {
      this.filteredProducts = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '', products))
      );
    });
  }

  private _filter(
    value: string,
    products: Partial<Product>[]
  ): Partial<Product>[] {
    const filterValue = value.toLowerCase();

    return products.filter((product) =>
      product?.name?.toLowerCase().includes(filterValue)
    );
  }

  onSelectionChanged(event: { option: { id: unknown; value: unknown } }) {
    const selectedValue = event.option.id;
    this._router.navigate(['/product', selectedValue]);
  }

  handleAddToCart(product: Partial<Product>) {
    if (product.categoryId === undefined || product.categoryId === null) return;
    const category = this._collection.getCategory(product.categoryId || '');
    this._subscriptions.add(
      category.subscribe((category) => {
        if (category?.subCategories && category.subCategories.length > 1) {
          this._notificationService.showNotification(
            'Please select a subcategory'
          );
          this._router.navigate(['/product', product.pid]);
        } else {
          this._store.dispatch(postCart({ products: product }));
          this._notificationService.showNotification(
            `${product.name} added to cart successfully`
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this._subscriptions.unsubscribe();
  }
}
