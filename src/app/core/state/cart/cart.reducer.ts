import * as PostsActions from './cart.actions';

import { createReducer, on } from '@ngrx/store';

import { Action } from '@ngrx/store';
import { Cart } from '../../../models/cart.model';

// product.reducer.ts

export const initialState: Cart = {
  products: [],
};

export const _cartReducer = createReducer(
  initialState,
  on(PostsActions.getCart, (state) => ({
    ...state,
  })),
  on(PostsActions.postCart, (state, action) => {
    state = {
      ...state,
      products: [...state.products, action.products],
    };

    return state;
  }),
  on(PostsActions.removeItemFromCart, (state, action) => {
    const products = [...state.products];
    const index = products.findIndex((x) => x.pid === action.product.pid);
    products.splice(index, 1);

    state = {
      ...state,
      products: products,
    };

    return state;
  }),
  on(PostsActions.getCartFailure, (state, action) => ({
    ...state,
    error: action.error,
  }))
);

export function cartReducer(state: Cart | undefined, action: Action) {
  return _cartReducer(state, action);
}
