import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccordionComponent } from './components/accordion/accordion.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { FilterByPipe } from './../pipes/filter-by.pipe';
import { GroupByPipe } from './../pipes/group-by.pipe';
import { MaterialModule } from '@newtone/material';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SheetComponent } from './components/sheet/sheet.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { TableComponent } from './components/table/table.component';
import { UploaderComponent } from './components/uploader/uploader.component';

const sharedComponents = [
  TableComponent,
  BreadcrumbComponent,
  DialogComponent,
  SheetComponent,
  UploaderComponent,
  StarRatingComponent,
  GroupByPipe,
  FilterByPipe,
  AccordionComponent,
];

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [sharedComponents, FormsModule, ReactiveFormsModule, MaterialModule],
})
export class SharedModule {}
