import { BannerComponent } from './banner/banner.component';
import { CommonModule } from '@angular/common';
import { FeaturedComponent } from './featured/featured.component';
import { HomeComponent } from './home.component';
import { LatestComponent } from './latest/latest.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AboutUsComponent } from './about-us/about-us.component';

@NgModule({
  declarations: [
    FeaturedComponent,
    LatestComponent,
    HomeComponent,
    BannerComponent,
    AboutUsComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
})
export class HomeModule {}
