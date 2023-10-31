import { Observable, map } from 'rxjs';

import { CollectionService } from './../../../services/collection.service';
import { Component } from '@angular/core';
import { Product } from './../../../models/product.model';

@Component({
  selector: 'newtone-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  totalProducts$: Observable<Partial<Product>[]> =
    this._collection.getProducts();

  inStockProducts$: Observable<Partial<Product>[]> = this._collection.getProducts().pipe(
    map(((inStockProducts: Partial<Product>[]) => {
      return inStockProducts.filter(product => (product.variants?.[0]?.stock ?? 0) - (product.stockThreshold ?? 0) <= 0);
    }))
  );

  outOfStockProducts$ = this._collection.getProducts().pipe(
    map((outOfStockProducts: Partial<Product>[]) => {
      return outOfStockProducts.filter(
        (product) => (product.variants?.[0]?.stock ?? 0) - (product.stockThreshold ?? 0) > 0
      );
    })
  );

  constructor(private _collection: CollectionService) {}
}
