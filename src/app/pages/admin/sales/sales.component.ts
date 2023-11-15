import { CollectionService } from './../../../services/collection.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './../../../models/order.model';

@Component({
  selector: 'newtone-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent {
  totalOrders$: Observable<Partial<Order>[]> =
  this._collection.getOrders();

// inStockProducts$: Observable<Partial<Order>[]> = this._collection.getOrders().pipe(
//   map(((inStockProducts: Partial<Order>[]) => {
//     return inStockProducts.filter(product => (product.variants?.[0]?.stock ?? 0) - (product.stockThreshold ?? 0) <= 0);
//   }))
// );

// outOfStockProducts$ = this._collection.getOrders().pipe(
//   map((outOfStockProducts: Partial<Order>[]) => {
//     return outOfStockProducts.filter(
//       (product) => (product.variants?.[0]?.stock ?? 0) - (product.stockThreshold ?? 0) > 0
//     );
//   })
// );

constructor(private _collection: CollectionService) {}
}
