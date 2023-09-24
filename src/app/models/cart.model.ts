import { Product } from './product.model';

export interface Cart {
  products: Partial<Product>[];
}
