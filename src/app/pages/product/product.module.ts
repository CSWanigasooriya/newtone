import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckoutComponent } from './checkout/checkout.component';
import { CommonModule } from '@angular/common';
import { CreateComponent } from '../admin/inventory/create/create.component';
import { ItemComponent } from './item/item.component';
import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    ProductComponent,
    ItemComponent,
    ViewComponent,
    CreateComponent,
    CheckoutComponent
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
