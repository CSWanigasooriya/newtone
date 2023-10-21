import { Injectable } from '@angular/core';
import { Product } from './../models/product.model';
import { ProductService } from './product.service';
import { User } from './../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor(
    private _userService: UserService,
    private _productService: ProductService
  ) {}

  getUsers() {
    return this._userService.getUsers();
  }

  updateUser(user: Partial<User> | null) {
    return this._userService.updateUser(user);
  }

  getProducts() {
    return this._productService.getProducts(100);
  }

  getCategories() {
    return this._productService.getCategories();
  }

  getCategory(cid: string) {
    return this._productService.getCategory(cid);
  }

  getProduct(pid: string) {
    return this._productService.getProduct(pid);
  }

  updateProduct(pid: string ,product: Partial<Product>) {
    return this._productService.updateProduct(pid, product);
  }

  createProduct(product: Partial<Product>) {
    return this._productService.createProduct(product);
  }

  deleteProduct(pid: string) {
    return this._productService.deleteProduct(pid);
  }

  deleteProducts(pids: string[]) {
    return this._productService.deleteProducts(pids);
  }

  // getFiles() {
  //   return this.filesCollection.valueChanges()
  // }
  // async getNotifications(receiver: string) {
  //   const notifications = await this.chatNotificationCollection.ref
  //     .where('receiver', '==', receiver)
  //     .get()
  //   return notifications.docs.map((doc) => doc.data())
  // }
  // getReviews() {
  //   return this.reviewsCollection.valueChanges()
  // }
  // async getAverageReviewScore(fileId: number) {
  //   const reviews = await this.reviewsCollection.ref.where('id', '==', fileId).get()
  //   const reviewCount = reviews.docs.length
  //   const reviewScore = reviews.docs.reduce((acc, curr) => {
  //     return acc + (curr.data().rating ? Number(curr.data().rating) : 0)
  //   }, 0)
  //   return reviewScore / reviewCount
  // }
  // async updateFile(file: Partial<FileContract>) {
  //   return await this.filesCollection.doc().set(file, { merge: true })
  // }
  // async updateReview(review: Partial<ReviewContract>) {
  //   return await this.reviewsCollection.doc().set(review, { merge: true })
  // }
}
