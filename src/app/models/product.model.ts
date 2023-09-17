import { Category } from './category.model';
import { Review } from './review.model';

export interface Product {
  pid: string;
  name: string;
  price: number;
  productDetails: ProductDetails;
  imageURLs?: string[];
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDetails {
  description: string;
  size: Size;
  color: string;
  brand: string;
  quantity: number;
  rating: number;
  reviews: Review[];
}

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}
