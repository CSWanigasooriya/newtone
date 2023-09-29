import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ViewComponent } from './view/view.component';
import { NewProductComponent } from './new-product/new-product.component';

@NgModule({
  declarations: [
    ProductComponent,
    ItemComponent,
    ViewComponent,
    NewProductComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
  ],
})
export class ProductModule {}
