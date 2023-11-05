import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { serverTimestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersCollection: AngularFirestoreCollection<Partial<Order>>;

  constructor(private afs: AngularFirestore) {
    this.ordersCollection = this.afs.collection<Partial<Order>>('order');
  }

  getOrder(orderId: string): Observable<Partial<Order> | undefined> {
    return this.ordersCollection.doc<Partial<Order>>(orderId).valueChanges();
  }

  getOrders() {
    return this.afs
      .collection<Partial<Order>>('order', (ref) =>
        ref.orderBy('orderDate')
      )
      .valueChanges();
  }

  async createOrder(order: Partial<Order>) {
    const id = this.afs.createId();
    return await this.ordersCollection.doc(id).set(
      {
        ...order,
        orderDate: serverTimestamp(),
        orderId: id,
      },
      { merge: true }
    );
  }

  async updateOrder(orderId: string, order: Partial<Order>) {
    return await this.ordersCollection.doc(orderId).set(
      {
        ...order,
        orderDate: serverTimestamp(),
      },
      { merge: true }
    );
  }

  async deleteOrder(orderId: string) {
    return await this.ordersCollection.doc(orderId).delete();
  }

  async deleteOrders(orderIds: string[]) {
    const batch = this.afs.firestore.batch();
    orderIds.forEach((orderId) => {
      const docRef = this.ordersCollection.doc(orderId).ref;
      batch.delete(docRef);
    });
    return await batch.commit();
  }

  // You can add more methods as needed for order-related operations.
  
}
