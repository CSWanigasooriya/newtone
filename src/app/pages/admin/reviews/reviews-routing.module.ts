import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { ReviewsComponent } from './reviews.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewsComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
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
export class ReviewsRoutingModule { }
