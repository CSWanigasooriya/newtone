import { CollectionService } from './../../../services/collection.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './../../../models/product.model';

@Component({
  selector: 'newtone-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  products$: Observable<Partial<Product>[]> = this._collection.getProducts();

  constructor(private _collection: CollectionService) {}
}
