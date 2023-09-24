import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { APP_CONFIG, AppConfig } from './../../../core/config/app.config';

import { Product } from '../../../models/product.model';

@Component({
  selector: 'newtone-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
  @Input() product: Partial<Product> = {};
  @Output() addToCart: EventEmitter<Product> = new EventEmitter();

  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}

  handleAddToCart(product: Partial<Product>) {
    this.addToCart.emit(product as Product);
  }
}
