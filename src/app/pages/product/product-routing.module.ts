import { RouterModule, Routes } from '@angular/router';

import { CheckoutComponent } from './checkout/checkout.component';
import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: '',
    component: ProductComponent,
  },
  {
    path: ':id',
    component: ViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
