import { Cart, CartItem } from './../../models/cart.model';
import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  postCart,
  removeItemFromCart,
} from './../../core/state/cart/cart.actions';

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
  cartItems: Partial<CartItem>[] = [];

  cart$: Observable<Cart> | undefined;
  private _subscriptions = new Subscription();
  constructor(private _store: Store<{ cart: Cart }>) {
    this.cart$ = this._store.select('cart');
    this._subscriptions.add(
      this.cart$.subscribe((cart) => {
        this.cartItems = cart.items;
      })
    );
  }

  onSubmit() {
    // You can handle form submission logic here
    console.log('Shipping Address: ' + this.shippingAddress);
    console.log('Full Name: ' + this.fullName);
    console.log('Email Address: ' + this.email);
    console.log('Phone Number: ' + this.phoneNumber);
    console.log('Payment Method: ' + this.paymentMethod);

    // You can send the form data to your backend or perform other actions.
    // For example, make an HTTP request to submit the order.
  }

  decrementQuantity(product: Partial<Product>) {
    // Decrease the quantity of a variant
    const cartItem = {
      product,
      quantity: 1,
    } as CartItem;
    this._store.dispatch(removeItemFromCart({ item: cartItem }));
  }

  // Increase the quantity of a variant
  incrementQuantity(product: Partial<Product>) {
    // Increase the quantity of a variant
    const cartItem = {
      product,
      quantity: 1,
    } as CartItem;
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
