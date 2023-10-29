import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Category } from '../models/category.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { serverTimestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Partial<Product>>;
  private categoriesCollection: AngularFirestoreCollection<Partial<Category>>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Partial<Product>>('product');
    this.categoriesCollection =
      this.afs.collection<Partial<Category>>('category');
  }

  getProduct(pid: string): Observable<Partial<Product> | undefined> {
    return this.productsCollection.doc<Partial<Product>>(pid).valueChanges();
  }

  getProducts() {
    return this.afs
      .collection<Partial<Product>>('product', (ref) =>
        ref.orderBy('updatedAt')
      )
      .valueChanges();
  }

  async createProduct(product: Partial<Product>) {
    const id = this.afs.createId();
    return await this.productsCollection.doc(id).set(
      {
        ...product,
        updatedAt: serverTimestamp(),
        productId: id,
      },
      { merge: true }
    );
  }

  async updateProduct(pid: string, product: Partial<Product>) {
    return await this.productsCollection.doc(pid).set(
      {
        ...product,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  async deleteProduct(pid: string) {
    return await this.productsCollection.doc(pid).delete();
  }

  async deleteProducts(pids: string[]) {
    const batch = this.afs.firestore.batch();
    pids.forEach((pid) => {
      const docRef = this.productsCollection.doc(pid).ref;
      batch.delete(docRef);
    });
    return await batch.commit();
  }

  // async createProduct(product: Partial<Product>) {
  //   return await this.productsCollection.doc(product.pid).set(product);
  // }

  getCategories() {
    return this.categoriesCollection.valueChanges();
  }

  getCategory(cid: string) {
    return this.categoriesCollection.doc(cid).valueChanges();
  }
}
