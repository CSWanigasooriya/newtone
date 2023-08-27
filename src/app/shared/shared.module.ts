import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '@newtone/material';
import { NgModule } from '@angular/core';
import { TableComponent } from './components/table/table.component';

const sharedComponents = [TableComponent];

@NgModule({
  declarations: [sharedComponents],
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  exports: [sharedComponents],
})
export class SharedModule {}
