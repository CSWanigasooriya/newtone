import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
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
