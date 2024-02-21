import { APP_CONFIG, AppConfig } from './../../../core/config/app.config';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'newtone-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
