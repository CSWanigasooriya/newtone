import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from './../../../shared/shared.module';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [ListComponent, EditComponent, ViewComponent, OrdersComponent],
  imports: [CommonModule, OrdersRoutingModule,SharedModule],
})
export class OrdersModule {}
