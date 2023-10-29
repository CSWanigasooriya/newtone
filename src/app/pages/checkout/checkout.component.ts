import { Product, ProductVariant } from './../../models/product.model';

import { Cart } from './../../models/cart.model';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'newtone-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  shippingAddress = '';
  fullName = '';
  email = '';
  phoneNumber = '';
  paymentMethod = '';

  cart$: Observable<Cart> | undefined;

  constructor(private _store: Store<{ cart: Cart }>) {
    this.cart$ = this._store.select('cart');
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

  decrementQuantity(variant: Partial<ProductVariant>) {
    // Decrease the quantity of a variant
  }

  // Increase the quantity of a variant
  incrementQuantity(variant: Partial<ProductVariant>) {
    // Increase the quantity of a variant
  }

  // Remove a variant from the cart
  removeFromCart(variant: Partial<ProductVariant>) {
    // Remove a variant from the cart
  }
}
