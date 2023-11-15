import { Component, OnDestroy } from '@angular/core';
import {
  PaginatorAction,
  TableAction,
  TableColumn,
} from './../../../../shared/components/table/table.component';
import { Product, Size } from './../../../../models/product.model';
import { Subscription, map } from 'rxjs';

import { AccordionData } from './../../../../shared/components/accordion/accordion.component';
import { BreakPointHelper } from '../../../../core/helpers/breakpoint.helper';
import { CollectionService } from './../../../../services/collection.service';
import { DialogComponent } from './../../../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

type TableData = Partial<
  | {
      productId: string;
      name: string;
      brand: string;
      stockThreshold: number;
      description: string;
      size: Size;
      color: string;
      weight: number;
      height: number;
      width: number;
      length: number;
      price: number;
      stock: number;
      image: string;
    }
  | undefined
>;

@Component({
  selector: 'newtone-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnDestroy {
  isSmallScreen$ = this._breakpointHelper.isSmallScreen$.pipe(
    map((state) => state.matches)
  );

  tableData: TableData[] = [];

  tableRowActions!: TableAction<Product>[];

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
      this._collection.getProducts().subscribe((products) => {
        this.tableData = products.map((product) => {
          return {
            productId: product.productId,
            name: product.name,
            brand: product.name,
            stockThreshold: product.stockThreshold,
            description: product.description,
            // size: product.size,
            color: product.variants?.[0]?.color,
            weight: product.variants?.[0]?.weight,
            height: product.variants?.[0]?.height,
            width: product.variants?.[0]?.width,
            length: product.variants?.[0]?.length,
            price: product?.variants?.reduce(
              (a, b) => Math.max(a, b.price || 0),
              -Infinity
            ),
            stock: product?.variants?.reduce(
              (a, b) => Math.max(a, b.stock || 0),
              -Infinity
            ),
            image: product.variants?.[0]?.image,
          };
        }) as TableData[];

        this.accordionData = {
          key: 'productId',
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
        name: 'Product Name',
        dataKey: 'name',
        isSortable: true,
      },
      {
        name: 'Brand',
        dataKey: 'brand',
        isSortable: true,
      },
      {
        name: 'Stock Threshold',
        dataKey: 'stockThreshold',
        isSortable: true,
      },
      {
        name: 'Description',
        dataKey: 'description',
        isSortable: true,
      },
      {
        name: 'Size',
        dataKey: 'size',
        isSortable: true,
      },
      {
        name: 'Color',
        dataKey: 'color',
        isSortable: true,
      },
      {
        name: 'Weight',
        dataKey: 'weight',
        isSortable: true,
      },
      {
        name: 'Length',
        dataKey: 'length',
        isSortable: true,
      },
      {
        name: 'Price',
        dataKey: 'price',
        isSortable: true,
      },
      {
        name: 'Stock',
        dataKey: 'stock',
        isSortable: true,
      },
      {
        name: 'Image',
        dataKey: 'image',
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

  onPaginatorAction(selectedRows: Product[]) {
    if (!selectedRows.length) return;
    this._matDialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        subtitle: `Are you sure you want to delete ${selectedRows.length} products?`,
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
              this._collection.deleteProducts(
                selectedRows.map((row) => row.productId)
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

  onRowAction(action: TableAction<Product>, item: Product = {} as Product) {
    if (action.id === 'edit') {
      this._router.navigate(['admin', 'inventory', 'edit', item.productId]);
    } else if (action.id === 'delete') {
      this.openDeleteDialog(item);
    }
  }

  openDeleteDialog(item: Product = {} as Product) {
    this._matDialog.open(DialogComponent, {
      data: {
        title: 'Delete',
        subtitle: `Are you sure you want to delete ${item.name}?`,
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
              this._collection.deleteProduct(item.productId);
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
