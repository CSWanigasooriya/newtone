import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialModule } from '@newtone/material';
import { NgModule } from '@angular/core';
import { SheetComponent } from './components/sheet/sheet.component';
import { TableComponent } from './components/table/table.component';
import { UploaderComponent } from './components/uploader/uploader.component';

const sharedComponents = [
  TableComponent,
  BreadcrumbComponent,
  DialogComponent,
  SheetComponent,
  UploaderComponent,
];

@NgModule({
  declarations: [sharedComponents],
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  exports: [sharedComponents, FormsModule, ReactiveFormsModule, MaterialModule],
})
export class SharedModule {}
