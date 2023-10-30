import { Cart, CartItem } from './../../models/cart.model';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, map, startWith } from 'rxjs';

import { CollectionService } from './../../services/collection.service';
import { FirestorePaginationService } from './../../services/firestore-pagination-service.service';
import { FormControl } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { NotificationService } from './../../shared/services/notification.service';
import { PageEvent } from '@angular/material/paginator';
import { Product } from './../../models/product.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { postCart } from './../../core/state/cart/cart.actions';

@Component({
  selector: 'newtone-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnDestroy {
  length = 0;
  pageSize = 12;
  pageIndex = 0;
  pageSizeOptions = [12, 24, 48];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = false;
  disabled = false;

  pageEvent: PageEvent = new PageEvent();

  cart$: Observable<Cart>;
  openDropdown = false;
  breadCrumb = ['HOME', 'PRODUCT'];
  searchControl = new FormControl('');
  products$: Observable<Partial<Product>[]> = this._collection.getProducts();
  filteredProducts$!: Observable<Partial<Product>[]>;
  mobileQuery: MediaQueryList;
  previousPageIndex = 0; // Initialize with 0, assuming the first page is 0

  private _mobileQueryListener: () => void;
  private _subscriptions = new Subscription();

  constructor(
    private _collection: CollectionService,
    private _paginatorService: FirestorePaginationService<Product>,
    private _router: Router,
    private _notificationService: NotificationService,
    private _store: Store<{ cart: Cart }>,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.cart$ = this._store.select('cart');

    this._paginatorService.initializePaginator('product', this.pageSize);
    this._subscriptions.add(
      this._collection.getProducts().subscribe((data) => {
        this.length = data.length;
      })
    );

    this._subscriptions.add(
      this._paginatorService.data.subscribe((data) => {
        this.filteredProducts$ = this.searchControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || '', data))
        );
      })
    );
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

  handlePageEvent(e: PageEvent) {
    this._paginatorService.initializePaginator('product', e.pageSize);
    // Check if the user clicked "Next" or "Back"
    if (e.pageIndex > this.pageIndex) {
      this._paginatorService.getNextPage('product', e.pageSize);
    } else if (e.pageIndex < this.pageIndex) {
      // "Back" button clicked
      this._paginatorService.getPreviousPage('product', e.pageSize);
    }

    this.filteredProducts$ = this._paginatorService.data;
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  resetPagination(): void {
    this._paginatorService.reset();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  onSelectionChanged(event: { option: { id: unknown; value: unknown } }) {
    const selectedValue = event.option.id;
    this._router.navigate(['/product', selectedValue]);
  }

  handleAddToCart(product: Partial<Product>) {
    if (
      product?.category?.categoryId === undefined ||
      product?.category?.categoryId === null
    )
      return;

    if (product?.variants?.length !== 1) {
      this._router.navigate(['/product', product?.productId]);
      this._notificationService.showNotification(
        'Please select a variant to add to cart'
      );
      return;
    }

    const cartItem = {
      product,
      quantity: 1,
    } as CartItem;
    this._store.dispatch(postCart({ item: cartItem }));
    this._notificationService.showNotification(
      `${product.name} added to cart successfully`
    );
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this._subscriptions.unsubscribe();
  }
}
