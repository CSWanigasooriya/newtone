import { Component, OnDestroy } from '@angular/core';
import {
  PaginatorAction,
  TableAction,
  TableColumn,
} from './../../../../shared/components/table/table.component';
import { Subscription, map } from 'rxjs';

import { AccordionData } from './../../../../shared/components/accordion/accordion.component';
import { BreakPointHelper } from '../../../../core/helpers/breakpoint.helper';
import { Category } from './../../../../models/category.model';
import { CollectionService } from './../../../../services/collection.service';
import { DialogComponent } from './../../../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

type TableData = Partial<
  | {
      categoryId: string;
      title: string;
      source: string;
      imageURL: string;
    }
  | undefined
>;

@Component({
  selector: 'newtone-list-category',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnDestroy {
  isSmallScreen$ = this._breakpointHelper.isSmallScreen$.pipe(
    map((state) => state.matches)
  );

  tableData: TableData[] = [];

  tableRowActions!: TableAction<Category>[];

  tableColumns: TableColumn[] = [];

  tablePaginatorAction: PaginatorAction = {};

  accordionData: AccordionData = {} as AccordionData;

  private _subscriptions = new Subscription();
  constructor(
    private _breakpointHelper: BreakPointHelper,
    private _collection: CollectionService,
    private _matDialog: MatDialog,
    private _router: Router
  ) {
    this.initializeTable();

    this._subscriptions.add(
      this._collection.getCategories().subscribe((categories) => {
        this.tableData = categories.map((category) => {
          return {
            categoryId: category.categoryId,
            title: category.title,
            source: category.source,
            imageURL: category.imageURL,
          };
        }) as TableData[];

        this.accordionData = {
          key: 'categoryId',
          content: this.tableData,
          actions: [
            {
              text: 'edit',
              icon: 'edit',
              event: () => {
                console.log('edited');
              },
            },
          ],
        };
      })
    );
  }

  private initializeTable(): void {
    this.tableColumns = [
      {
        name: 'Category Title',
        dataKey: 'title',
        isSortable: true,
      },
      {
        name: 'Source',
        dataKey: 'source',
        isSortable: true,
      },
      {
        name: 'Image',
        dataKey: 'imageURL',
        isSortable: false,
      },
    ];

    this.tableRowActions = [
      {
        id: 'edit',
        icon: 'edit',
        color: 'primary',
        tooltip: 'Edit',
        action: (item) => {
          this.onRowAction(this.tableRowActions[0], item);
        },
      },
      {
        id: 'delete',
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete',
        action: (item) => {
          this.onRowAction(this.tableRowActions[1], item);
        },
      },
    ];

    this.tablePaginatorAction = {
      text: 'Delete',
      icon: 'delete',
      style: 'mat-stroked-button',
      color: 'warn',
      count: true,
    };
  }

  onSelectionChange(selectedRows: unknown[]) {
    console.log(selectedRows);
  }

  onPaginatorAction(selectedRows: Category[]) {
    if (!selectedRows.length) return;
    this._matDialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        subtitle: `Are you sure you want to delete ${selectedRows.length} categories?`,
        description: 'This action cannot be undone.',
        actions: [
          {
            text: 'Cancel',
            action: () => false,
            style: 'mat-stroked-button',
          },
          {
            text: 'Delete',
            action: () => {
              this._collection.deleteCategories(
                selectedRows.map((row) => row.categoryId)
              );
            },
            style: 'mat-stroked-button',
            color: 'warn',
          },
        ],
      },
    });
  }

  sortData(sortParameters: Sort) {
    const keyName = sortParameters.active;
    console.log(keyName);

    if (sortParameters.direction === 'asc') {
      this.tableData = this.tableData.sort((a: TableData, b: TableData) =>
        a![keyName as keyof TableData] > b![keyName as keyof TableData] ? 1 : -1
      );
    } else if (sortParameters.direction === 'desc') {
      this.tableData = this.tableData.sort((a: TableData, b: TableData) =>
        a![keyName as keyof TableData] < b![keyName as keyof TableData] ? 1 : -1
      );
    }
  }

  onRowAction(action: TableAction<Category>, item: Category = {} as Category) {
    if (action.id === 'edit') {
      this._router.navigate(['admin', 'categories', 'edit', item.categoryId]);
    } else if (action.id === 'delete') {
      this.openDeleteDialog(item);
    }
  }

  openDeleteDialog(item: Category = {} as Category) {
    this._matDialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        subtitle: `Are you sure you want to delete ${item.title}?`,
        description: 'This action cannot be undone.',
        actions: [
          {
            text: 'Cancel',
            action: () => false,
            style: 'mat-stroked-button',
          },
          {
            text: 'Delete',
            action: () => {
              this._collection.deleteCategory(item.categoryId);
            },
            style: 'mat-stroked-button',
            color: 'warn',
          },
        ],
      },
    });
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}
