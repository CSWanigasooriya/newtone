import { Component, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../core/config/app.config';

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
  iconButtons: ToolbarIconButton[] = [];
  breadcrumbs = ['Home', 'About', 'Contact'];

  constructor(@Inject(APP_CONFIG) public config: AppConfig) {
    this.iconButtons = [
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
}
