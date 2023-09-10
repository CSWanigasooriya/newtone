import { Component, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../core/config/app.config';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { toggle } from '../core/state/theme/theme.actions';

interface ToolbarIconButton {
  icon: string;
  tooltip: string;
  action: () => void;
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
          console.log('Cart');
        },
      },
    ];
  }

  private _toggleTheme() {
    this._store.dispatch(toggle());
  }
}
