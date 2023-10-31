import { Product } from './product.model';

export interface Cart {
  items: Partial<CartItem>[];
}

export interface CartItem {
  product: Partial<Product>;
  quantity?: number;
}
