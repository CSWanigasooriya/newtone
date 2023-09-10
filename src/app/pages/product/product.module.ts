import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [ProductComponent, ItemComponent, ViewComponent],
  imports: [CommonModule, SharedModule, ProductRoutingModule],
})
export class ProductModule {}