import { Component, Input } from '@angular/core';

import { Product } from '../../../models/product.model';

@Component({
  selector: 'newtone-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
  @Input() product: Partial<Product> = {};
}
