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
import { Order } from './../../../../models/order.model';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

type TableData = Partial<
  | {
      orderId: string;
      shippingAddress: string;
    }
  | undefined
>;

@Component({
  selector: 'newtone-list-orders',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnDestroy {
  isSmallScreen$ = this._breakpointHelper.isSmallScreen$.pipe(
    map((state) => state.matches)
  );

  tableData: TableData[] = [];

  tableRowActions!: TableAction<Order>[];

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
      this._collection.getOrders().subscribe((orders) => {
        this.tableData = orders.map((order) => {
          return {
            orderId: order.orderId,
            shippingAddress: order.shippingAddress,
          };
        }) as TableData[];

        this.accordionData = {
          key: 'orderId',
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
        name: 'Order Id',
        dataKey: 'orderId',
        isSortable: true,
      },
      {
        name: 'Shipping Address',
        dataKey: 'shippingAddress',
        isSortable: true,
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

  onPaginatorAction(selectedRows: Order[]) {
    if (!selectedRows.length) return;
    this._matDialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        subtitle: `Are you sure you want to delete ${selectedRows.length} orders?`,
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
              this._collection.deleteOrders(
                selectedRows.map((row) => row.orderId)
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

  onRowAction(action: TableAction<Order>, item: Order = {} as Order) {
    if (action.id === 'edit') {
      this._router.navigate(['admin', 'orders', 'edit', item.orderId]);
    } else if (action.id === 'delete') {
      this.openDeleteDialog(item);
    }
  }

  openDeleteDialog(item: Order = {} as Order) {
    this._matDialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        subtitle: `Are you sure you want to delete ${item.shippingAddress}?`,
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
              this._collection.deleteOrder(item.orderId);
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
