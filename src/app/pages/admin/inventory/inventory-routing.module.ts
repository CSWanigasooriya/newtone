import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { InventoryComponent } from './inventory.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
      },
      {
        path: 'create',
        component: CreateComponent,
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
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
