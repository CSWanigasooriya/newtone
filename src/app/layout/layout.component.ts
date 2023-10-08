import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../core/config/app.config';
import { toggle } from '../core/state/theme/theme.actions';
import { Product } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { CollectionService } from '../services/collection.service';
import { SheetComponent } from '../shared/components/sheet/sheet.component';
import { Cart } from './../models/cart.model';

interface ToolbarIconButton {
  icon: string;
  tooltip: string;
  action: () => void;
  badge?: number;
}

interface NavItem {
  name: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'newtone-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnDestroy {
  theme$: Observable<boolean>;
  navItems: NavItem[] = [];
  iconButtons: ToolbarIconButton[] = [];
  breadcrumbs = ['Home', 'About', 'Contact'];
  searchControl = new FormControl('');
  products$ = this._collection.getProducts();
  filteredProducts!: Observable<Partial<Product>[]>;
  cart$: Observable<Cart>;
  cartSize = 0;

  private _subscriptions = new Subscription();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private _bottomSheet: MatBottomSheet,
    private _collection: CollectionService,
    private _store: Store<{ count: number; theme: boolean; cart: Cart }>,
    private _router: Router,
    private _auth: AuthService
  ) {
    this.cart$ = this._store.select('cart');

    this._subscriptions.add(
      this.cart$.subscribe((cart) => {
        this.cartSize = cart.products.length;
      })
    );
    this.products$.subscribe((products) => {
      this.filteredProducts = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '', products))
      );
    });

    this.theme$ = _store.select('theme');

    this.navItems = [
      {
        name: 'Electric',
        route: '/',
        icon: 'home',
      },
      {
        name: 'Acoustic',
        route: '/about',
        icon: 'info',
      },
      {
        name: 'Bass',
        route: '/contact',
        icon: 'contact_support',
      },
      {
        name: 'Accessories',
        route: '/contact',
        icon: 'contact_support',
      },
    ];

    this.iconButtons = [
      {
        icon: 'dark_mode',
        tooltip: 'Dark Mode',
        action: () => {
          this._toggleTheme();
        },
      },
      {
        icon: 'settings',
        tooltip: 'Settings',
        action: () => {
          this._auth.signOut();
        },
      },
      {
        icon: 'shopping_cart',
        tooltip: 'Cart',
        action: () => {
          this._openBottomSheet();
        },
        badge: -1,
      },
    ];
  }

  private _toggleTheme() {
    this._store.dispatch(toggle());
  }

  private _openBottomSheet(): void {
    this._bottomSheet.open(SheetComponent);
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

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
