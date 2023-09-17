import { Component, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../core/config/app.config';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { toggle } from '../core/state/theme/theme.actions';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SheetComponent } from '../shared/components/sheet/sheet.component';

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

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private _bottomSheet: MatBottomSheet,
    private _store: Store<{ count: number; theme: boolean }>
  ) {
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
}
