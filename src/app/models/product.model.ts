import { Category } from './category.model';
import { FieldValue } from '@angular/fire/firestore';
import { Review } from './review.model';

export interface Product {
  productId: string;
  name: string;
  brand: string;
  variants: Partial<ProductVariant>[];
  category: Partial<Category>;
  stockThreshold: number;
  description: string;
  rating: number;
  reviews: Review[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface ProductVariant {
  variantId: string;
  quantity: number;
  size: Size;
  color: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  price: number;
  stock: number;
  image: string;
}

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  UNKNOWN = 'unknown',
}
