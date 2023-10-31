import { createAction, props } from '@ngrx/store';

import { CartItem } from './../../../models/cart.model';

// product.action.ts

export const getCart = createAction('[Cart] Get Cart Items');

export const postCart = createAction(
  '[Cart] Post Cart',
  props<{ item: Partial<CartItem> }>()
);

export const removeItemFromCart = createAction(
  '[Cart] Remove Item from Cart',
  props<{ item: Partial<CartItem> }>()
);

export const getCartFailure = createAction(
  '[Cart] Get Cart failure',
  props<{ error: string }>()
);
