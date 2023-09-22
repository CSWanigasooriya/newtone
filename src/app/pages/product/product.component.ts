import { Observable, map, startWith } from 'rxjs';

import { CollectionService } from '../../services/collection.service';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Product } from './../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'newtone-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  openDropdown = false;
  breadCrumb = ['HOME', 'PRODUCT'];
  searchControl = new FormControl('');
  products$ = this._collection.getProducts();
  filteredProducts!: Observable<Partial<Product>[]>;

  constructor(private _collection: CollectionService, private _router: Router) {
    this.products$.subscribe((products) => {
      this.filteredProducts = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '', products))
      );
    });
  }

  private _filter(
    value: string,
    products: Partial<Product>[]
  ): Partial<Product>[] {
    const filterValue = value.toLowerCase();

    return products.filter((product) =>
      product?.name?.toLowerCase().includes(filterValue)
    );
  }

  onSelectionChanged(event: { option: { id: unknown; value: unknown } }) {
    const selectedValue = event.option.id;
    this._router.navigate(['/product', selectedValue]);
  }
}
