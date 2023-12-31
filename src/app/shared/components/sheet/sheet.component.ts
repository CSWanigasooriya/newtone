import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { removeItemFromCart } from './../../../core/state/cart/cart.actions';
import { Cart, CartItem } from './../../../models/cart.model';
import { Product } from './../../../models/product.model';
import { MatSelectionList } from '@angular/material/list';

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
  @ViewChild('items') items: MatSelectionList | undefined;

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
        this.subTotal = cart.items.reduce(
          (acc: number, product) =>
            Number(acc) + Number(product?.product?.variants?.[0]?.price || 0),
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
    const cartItem = {
      product,
    } as CartItem;
    this._store.dispatch(removeItemFromCart({ item: cartItem }));
  }

  deleteSelectedItems() {
    this.items?.selectedOptions.selected.map(async (item) => {
      this.removeFromCart({ productId: item.value.key });
    });
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
