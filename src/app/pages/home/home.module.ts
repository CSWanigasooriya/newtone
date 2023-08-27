import { BannerComponent } from './banner/banner.component';
import { CommonModule } from '@angular/common';
import { FeaturedComponent } from './featured/featured.component';
import { HomeComponent } from './home.component';
import { LatestComponent } from './latest/latest.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    FeaturedComponent,
    LatestComponent,
    HomeComponent,
    BannerComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class HomeModule {}
