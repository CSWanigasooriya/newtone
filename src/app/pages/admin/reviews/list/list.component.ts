import { Component, OnDestroy } from '@angular/core';
import {
  PaginatorAction,
  TableAction,
  TableColumn,
} from './../../../../shared/components/table/table.component';
import { Subscription, map } from 'rxjs';

import { AccordionData } from './../../../../shared/components/accordion/accordion.component';
import { BreakPointHelper } from '../../../../core/helpers/breakpoint.helper';
import { CollectionService } from './../../../../services/collection.service';
import { DialogComponent } from './../../../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Review } from './../../../../models/review.model';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

type TableData = Partial<
  | {
      reviewId: string;
      comment: string;
    }
  | undefined
>;

@Component({
  selector: 'newtone-list-review',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnDestroy {
  isSmallScreen$ = this._breakpointHelper.isSmallScreen$.pipe(
    map((state) => state.matches)
  );

  tableData: TableData[] = [];

  tableRowActions!: TableAction<Review>[];

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
      this._collection.getReviews().subscribe((reviews) => {
        this.tableData = reviews.map((review) => {
          return {
            reviewId: review.reviewId,
            comment: review.comment,
          };
        }) as TableData[];

        this.accordionData = {
          key: 'reviewId',
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
        name: 'Review Id',
        dataKey: 'reviewId',
        isSortable: true,
      },
      {
        name: 'Comment',
        dataKey: 'comment',
        isSortable: true,
      },
    ];

    this.tableRowActions = [
      {
        id: 'view',
        icon: 'visibility',
        color: 'accent',
        tooltip: 'View',
        action: (item) => {
          this.onRowAction(this.tableRowActions[0], item);
        },
      },
      {
        id: 'edit',
        icon: 'edit',
        color: 'primary',
        tooltip: 'Edit',
        action: (item) => {
          this.onRowAction(this.tableRowActions[1], item);
        },
      },
      {
        id: 'delete',
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete',
        action: (item) => {
          this.onRowAction(this.tableRowActions[2], item);
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

  onPaginatorAction(selectedRows: Review[]) {
    if (!selectedRows.length) return;
    this._matDialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        subtitle: `Are you sure you want to delete ${selectedRows.length} reviews?`,
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
              this._collection.deleteReviews(
                selectedRows.map((row) => row.reviewId)
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

  onRowAction(action: TableAction<Review>, item: Review = {} as Review) {
    if (action.id === 'edit') {
      this._router.navigate(['admin', 'reviews', 'edit', item.reviewId]);
    } else if (action.id === 'delete') {
      this.openDeleteDialog(item);
    }
  }

  openDeleteDialog(item: Review = {} as Review) {
    this._matDialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        subtitle: `Are you sure you want to delete ${item.comment}?`,
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
              this._collection.deleteReview(item.reviewId);
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
