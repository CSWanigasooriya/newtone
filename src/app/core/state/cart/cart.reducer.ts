import * as PostsActions from './cart.actions';

import { createReducer, on } from '@ngrx/store';

import { Action } from '@ngrx/store';
import { Cart } from '../../../models/cart.model';

// product.reducer.ts

export const initialState: Cart = {
  items: [],
};

export const _cartReducer = createReducer(
  initialState,
  on(PostsActions.getCart, (state) => ({
    ...state,
  })),
  on(PostsActions.postCart, (state, action) => {
    state = {
      ...state,
      items: [...state.items, action.item],
    };

    return state;
  }),
  on(PostsActions.removeAllItemsFromCart, (state) => ({
    ...state,
    items: [],
  })),
  on(PostsActions.removeItemFromCart, (state, action) => {
    const items = [...state.items];
    const index = items.findIndex(
      (x) => x.product?.productId === action.item?.product?.productId
    );
    items.splice(index, 1);

    state = {
      ...state,
      items: items,
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
