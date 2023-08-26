import { BannerComponent } from './banner/banner.component';
import { CommonModule } from '@angular/common';
import { FeaturedComponent } from './featured/featured.component';
import { HomeComponent } from './home.component';
import { LatestComponent } from './latest/latest.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    FeaturedComponent,
    LatestComponent,
    HomeComponent,
    BannerComponent,
  ],
  imports: [CommonModule],
})
export class HomeModule {}
