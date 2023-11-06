import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { ReviewsComponent } from './reviews.component';
import { ReviewsRoutingModule } from './reviews-routing.module';
import { SharedModule } from './../../../shared/shared.module';

@NgModule({
  declarations: [ListComponent, ReviewsComponent],
  imports: [CommonModule, ReviewsRoutingModule, SharedModule],
})
export class ReviewsModule {}
