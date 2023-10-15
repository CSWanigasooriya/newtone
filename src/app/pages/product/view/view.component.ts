import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { CollectionService } from '../../../services/collection.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'newtone-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  activeSlide = 0;
  product$!: Observable<Partial<Product> | undefined>;
  selectedId!: string | null | undefined;
  constructor(
    private route: ActivatedRoute,
    private _collection: CollectionService
  ) {}

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = params.get('id')?.trim();
        console.log(this.selectedId);
        return this._collection.getProduct(this.selectedId || '');
      })
    );
  }
}
