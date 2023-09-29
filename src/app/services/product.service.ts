import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Product, ProductDetails } from '../models/product.model';

import { Category } from '../models/category.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  getProducts(): Observable<Partial<Product>[]> {
    return this.productsCollection.valueChanges();
  }

  async updateNewProduct(product: Partial<Product> | Partial<ProductDetails>) {
    const id = this.afs.createId();
    return this.afs
      .collection('product')
      .doc(id)
      .set(
        {
          ...product,
          pid: id,
        },
        { merge: true }
      );
  }

  async updateProduct(product: Partial<Product>) {
    return await this.productsCollection
      .doc(product.pid)
      .set(product, { merge: true });
  }

  async deleteProduct(pid: string) {
    return await this.productsCollection.doc(pid).delete();
  }

  async createProduct(product: Partial<Product>) {
    return await this.productsCollection.doc(product.pid).set(product);
  }

  getCategories() {
    return this.categoriesCollection.valueChanges();
  }
}
