import { Component, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../core/config/app.config';

@Component({
  selector: 'newtone-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
