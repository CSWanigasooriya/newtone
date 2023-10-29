import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { APP_CONFIG, AppConfig } from './../../../core/config/app.config';

import { Product, ProductVariant } from '../../../models/product.model';

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

  getMinStock(variants: Partial<ProductVariant>[] | undefined) {
    return variants?.reduce((min, current) => {
      if (current.stock !== undefined) {
        return Math.min(min, current.stock);
      }
      return min;
    }, Number.MAX_SAFE_INTEGER);
  }
}
