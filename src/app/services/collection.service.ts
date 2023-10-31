import { Injectable } from '@angular/core';
import { Order } from './../models/order.model'; // Import the Order model
import { OrderService } from './order.service'; // Import the OrderService
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
    private _productService: ProductService,
    private _orderService: OrderService // Inject the OrderService
  ) {}

  getUsers() {
    return this._userService.getUsers();
  }

  updateUser(user: Partial<User> | null) {
    return this._userService.updateUser(user);
  }

  getProducts() {
    return this._productService.getProducts();
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

  updateProduct(pid: string, product: Partial<Product>) {
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

  // Order service methods
  getOrders() {
    return this._orderService.getOrders();
  }

  createOrder(order: Partial<Order>) {
    return this._orderService.createOrder(order);
  }

  updateOrder(orderId: string, order: Partial<Order>) {
    return this._orderService.updateOrder(orderId, order);
  }

  deleteOrder(orderId: string) {
    return this._orderService.deleteOrder(orderId);
  }

  // Add more order-related methods as needed

}
