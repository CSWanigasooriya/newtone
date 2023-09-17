import { Component, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../core/config/app.config';
import { Observable, map, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { toggle } from '../core/state/theme/theme.actions';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SheetComponent } from '../shared/components/sheet/sheet.component';
import { FormControl } from '@angular/forms';
import { Product } from '../models/product.model';
import { CollectionService } from '../services/collection.service';
import { Router } from '@angular/router';

interface ToolbarIconButton {
  icon: string;
  tooltip: string;
  action: () => void;
  badge?: number;
}

@Component({
  selector: 'newtone-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  theme$: Observable<boolean>;
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
    private _router: Router
  ) {
    this.products$.subscribe((products) => {
      this.filteredProducts = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '', products))
      );
    });
    this.theme$ = _store.select('theme');
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
          console.log('Settings');
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
