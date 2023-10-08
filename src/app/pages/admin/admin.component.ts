import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from './../../core/config/app.config';
import { toggle } from './../../core/state/theme/theme.actions';

@Component({
  selector: 'newtone-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
 
  selected = 0;
  isEnlarge = true;



  sideNavItems = [
    {
      icon: 'dashboard',
      text: 'Dashboard',
      link: '/admin/dashboard',
    },
    {
      icon: 'inventory',
      text: 'Inventory',
      link: '/admin/inventory',
    },
    {
      icon: 'point_of_sale',
      text: 'Sales',
      link: '/admin/sales',
    },
  ];

  enlarge = {
    decrease: 'chevron_left',
    enlarge: 'chevron_right',
  };

  theme$: Observable<boolean>;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private _store: Store<{ count: number; theme: boolean }>
  ) {
    this.theme$ = _store.select('theme');
  }

  private _toggleTheme() {
    this._store.dispatch(toggle());
  }
}
