import { SheetComponent } from './../../shared/components/sheet/sheet.component';
import { toggle } from './../../core/state/theme/theme.actions';
import { AuthService } from './../../services/auth.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CollectionService } from './../../services/collection.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Product } from './../../models/product.model';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { AppConfig, APP_CONFIG } from './../../core/config/app.config';
import { Component, Inject } from '@angular/core';

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
  selector: 'newtone-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  theme$: Observable<boolean>;
  navItems: NavItem[] = [];
  iconButtons: ToolbarIconButton[] = [];
  breadcrumbs = ['Home', 'About', 'Contact'];
  searchControl = new FormControl('');
  products$ = this._collection.getProducts();
  filteredProducts!: Observable<Partial<Product>[]>;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private _bottomSheet: MatBottomSheet,
    private _collection: CollectionService,
    private _store: Store<{ count: number; theme: boolean }>,
    private _router: Router,
    private _auth: AuthService
  ) {
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
        badge: 5,
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
}
