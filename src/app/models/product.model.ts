import { Category } from './category.model';
import { FieldValue } from '@angular/fire/firestore';
import { Review } from './review.model';

export interface Product {
  pid: string;
  name: string;
  price: number;
  productAttributes: Partial<ProductAttributes>;
  imageURLs?: string[];
  category: Category;
  stockThreshold: number;
  description: string;
  rating: number;
  reviews: Review[];
  stock: number;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface ProductAttributes {
  size: Size;
  color: string;
  brand: string;
  weight: number;
  height: number;
  width: number;
  length: number;
}

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  UNKNOWN = 'unknown',
}
