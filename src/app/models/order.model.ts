import { FieldValue } from '@angular/fire/firestore';
import { ProductVariant } from './product.model';

export interface Order {
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variants: Partial<ProductVariant>[]; // Array of variants for the product
  orderDate: FieldValue;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  orderStatus: OrderStatus;
}

export enum OrderStatus {
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Canceled = 'Canceled',
  // Add more status options as needed
}
