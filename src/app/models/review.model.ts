import { FieldValue } from '@angular/fire/firestore';
import { User } from './user.model';

export interface Review {
  reviewId: string;
  productId: string;
  user: Partial<User>;
  comment: string;
  rating: number;
  createdAt: FieldValue;
}
