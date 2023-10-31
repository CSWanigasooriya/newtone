import { Cart, CartItem } from './../../models/cart.model';
import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  postCart,
  removeAllItemsFromCart,
  removeItemFromCart,
} from './../../core/state/cart/cart.actions';

import { CollectionService } from './../../services/collection.service';
import { NotificationService } from './../../shared/services/notification.service';
import { Order } from './../../models/order.model';
import { Product } from './../../models/product.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'newtone-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnDestroy {
  shippingAddress = '';
  fullName = '';
  email = '';
  phoneNumber = '';
  paymentMethod = '';
  shippingCity = '';
  shippingZipCode = '';
  cartItems: Partial<CartItem>[] = [];

  cart$: Observable<Cart> | undefined;
  private _subscriptions = new Subscription();
  constructor(
    private _store: Store<{ cart: Cart }>,
    private _collection: CollectionService,
    private _notificationService: NotificationService
  ) {
    this.cart$ = this._store.select('cart');
    this._subscriptions.add(
      this.cart$.subscribe((cart) => {
        this.cartItems = cart.items;
      })
    );
  }

  isFormValid(): boolean {
    return (
      this.fullName !== '' &&
      this.email !== '' &&
      this.phoneNumber !== '' &&
      this.shippingAddress !== '' &&
      this.paymentMethod !== ''
    );
  }

  onSubmit() {

    if(!this.isFormValid()) return;

    const order = {
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      items: this.cartItems,
    } as Partial<Order>;

    this._collection.createOrder(order).then(
      () => {
        this._notificationService.showNotification('Order placed successfully');
        this._store.dispatch(removeAllItemsFromCart());
        this.cartItems = [];
      },
      () => {
        this._notificationService.showError({
          code: 'Error',
          message: 'Something went wrong',
        });
      }
    );
  }

  decrementQuantity(product: Partial<Product>) {
    // Decrease the quantity of a variant
    const cartItem = {
      product,
      quantity: 1,
    } as CartItem;
    this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    this._store.dispatch(removeItemFromCart({ item: cartItem }));
  }

  // Increase the quantity of a variant
  incrementQuantity(product: Partial<Product>) {
    // Increase the quantity of a variant
    const cartItem = {
      product,
      quantity: 1,
    } as CartItem;
    this.cartItems.push(cartItem);
    this._store.dispatch(postCart({ item: cartItem }));
  }

  calculateTotal(): number {
    let total = 0;

    for (const item of this.cartItems) {
      if (item.product && item.product.variants) {
        for (const variant of item.product.variants) {
          total += Number(variant.price);
        }
      }
    }

    return total;
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
