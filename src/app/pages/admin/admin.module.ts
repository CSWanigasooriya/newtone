import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DashboardComponent, AdminComponent],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
