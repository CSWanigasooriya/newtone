import { Category } from './category.model';
import { Review } from './review.model';

export interface Product {
  pid: string;
  name: string;
  price: number;
  productDetails: Partial <ProductDetails>;
  imageURLs?: string[];
  category: Category;
  stockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDetails {
  description: string;
  size: Size;
  color: string;
  brand: string;
  stock: number;
  rating: number;
  reviews: Review[];
}

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}
