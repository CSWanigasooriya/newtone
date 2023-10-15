import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { CollectionService } from '../../../services/collection.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'newtone-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  activeIndex = 0;
  images: string[] = [];
  product$!: Observable<Partial<Product> | undefined>;
  selectedId!: string | null | undefined;

  private _subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private _collection: CollectionService
  ) {}

  ngOnInit() {
    this.showSlide(this.activeIndex);

    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = params.get('id')?.trim();
        console.log(this.selectedId);
        return this._collection.getProduct(this.selectedId || '');
      })
    );
    this._subscriptions.add(
      this.product$.subscribe((product) => {
        this.images = product?.imageURLs || [];
      })
    );
  }

  showSlide(index: number): void {
    this.activeIndex = index;
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.activeIndex =
      (this.activeIndex - 1 + this.images.length) % this.images.length;
  }
}
