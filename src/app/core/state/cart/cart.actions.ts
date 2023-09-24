import { createAction, props } from '@ngrx/store';

import { Product } from '../../../models/product.model';

// product.action.ts

export const getCart = createAction('[Cart] Get Cart Items');

export const postCart = createAction(
  '[Cart] Post Cart',
  props<{ products: Partial<Product> }>()
);

export const removeItemFromCart = createAction(
  '[Cart] Remove Item from Cart',
  props<{ product: Partial<Product> }>()
);

export const getCartFailure = createAction(
  '[Cart] Get Cart failure',
  props<{ error: string }>()
);
