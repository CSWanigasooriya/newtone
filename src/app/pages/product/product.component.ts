import { Observable, map, startWith } from 'rxjs';

import { Cart } from './../../models/cart.model';
import { CollectionService } from '../../services/collection.service';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
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
export class ProductComponent {
  cart$: Observable<Cart>;
  openDropdown = false;
  breadCrumb = ['HOME', 'PRODUCT'];
  searchControl = new FormControl('');
  products$ = this._collection.getProducts();
  filteredProducts!: Observable<Partial<Product>[]>;

  constructor(
    private _collection: CollectionService,
    private _router: Router,
    private _notificationService: NotificationService,
    private _store: Store<{ cart: Cart }>
  ) {
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
    this._notificationService.showNotification(
      `${product.name} added to cart successfully`
    );
    this._store.dispatch(postCart({ products: product }));
  }
}
