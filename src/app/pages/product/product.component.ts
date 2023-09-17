import { CollectionService } from '../../services/collection.service';
import { Component } from '@angular/core';
@Component({
  selector: 'newtone-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  breadCrumb = ['HOME', 'PRODUCT'];

  products$ = this._collection.getProducts();

  constructor(private _collection: CollectionService) {}
}
