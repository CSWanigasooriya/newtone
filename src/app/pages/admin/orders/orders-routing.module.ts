import { RouterModule, Routes } from '@angular/router';

import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { OrdersComponent } from './orders.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
      },
      {
        path: 'view',
        component: ViewComponent,
      },
      {
        path: 'edit/:pid',
        component: EditComponent,
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
