import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Product } from '../../../models/product.model';

@Component({
  selector: 'newtone-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
  @Input() product: Partial<Product> = {};
  @Output() addToCart: EventEmitter<Product> = new EventEmitter();

  handleAddToCart(product: Partial<Product>) {
    this.addToCart.emit(product as Product);
  }
}
