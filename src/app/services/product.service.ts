import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Partial<Product>>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Partial<Product>>('product');
  }

  getProduct(pid: string): Observable<Partial<Product> | undefined> {
    return this.productsCollection.doc<Partial<Product>>(pid).valueChanges();
  }

  getProducts(): Observable<Partial<Product>[]> {
    return this.productsCollection.valueChanges();
  }

  async updateProduct(product: Partial<Product>) {
    return await this.productsCollection
      .doc(product.pid)
      .set(product, { merge: true });
  }
}
