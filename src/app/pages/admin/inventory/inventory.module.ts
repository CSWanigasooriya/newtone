import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { InventoryComponent } from './inventory.component';
import { SharedModule } from './../../../shared/shared.module';

@NgModule({
  declarations: [ListComponent, EditComponent, InventoryComponent],
  imports: [CommonModule, InventoryRoutingModule, SharedModule],
})
export class InventoryModule {}
