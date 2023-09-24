import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { removeItemFromCart } from './../../../core/state/cart/cart.actions';
import { Cart } from './../../../models/cart.model';
import { Product } from './../../../models/product.model';

export interface SheetData {
  names: string[];
}

@Component({
  selector: 'newtone-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent implements OnDestroy {
  cart$: Observable<Cart>;
  subTotal = 0;

  private _subscriptions = new Subscription();

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: SheetData,
    public bottomSheetRef: MatBottomSheetRef<SheetComponent>,
    private _store: Store<{ cart: Cart }>
  ) {
    this.cart$ = this._store.select('cart');
    this._subscriptions.add(
      this.cart$.subscribe((cart) => {
        this.subTotal = cart.products.reduce(
          (acc: number, product) => Number(acc) + Number(product.price || 0),
          0
        );
      })
    );
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  deleteItem(product: Partial<Product>) {
    this.removeFromCart(product);
  }

  removeFromCart(product: Partial<Product>) {
    this._store.dispatch(removeItemFromCart({ product: product }));
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
