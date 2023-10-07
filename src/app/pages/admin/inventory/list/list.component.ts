import {
  PaginatorAction,
  TableAction,
  TableColumn,
} from './../../../../shared/components/table/table.component';

import { AccordionData } from './../../../../shared/components/accordion/accordion.component';
import { BreakPointHelper } from '../../../../core/helpers/breakpoint.helper';
import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { User } from './../../../../models/user.model';
import { map } from 'rxjs';

type TableData = Partial<User | undefined>;

@Component({
  selector: 'newtone-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  isSmallScreen$ = this.breakpointHelper.isSmallScreen$.pipe(
    map((state) => state.matches)
  );

  tableData: TableData[] = [];

  tableRowActions!: TableAction<unknown>[];

  tableColumns: TableColumn[] = [];

  tablePaginatorAction: PaginatorAction = {};

  accordionData: AccordionData;

  constructor(private breakpointHelper: BreakPointHelper) {
    this.initializeTable();
    this.tableData = [
      {
        uid: '1',
        displayName: 'John Doe',
        email: '',
      },
      {
        uid: '2',
        displayName: 'Jane Doe',
        email: '',
      },
    ];

    this.accordionData = {
      key: 'uid',
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
  }

  private initializeTable(): void {
    this.tableColumns = [
      {
        name: 'UID',
        dataKey: 'uid',
        isSortable: true,
      },
      {
        name: 'Display Name',
        dataKey: 'displayName',
        isSortable: true,
      },
      {
        name: 'Email',
        dataKey: 'email',
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
          console.log(item);
        },
      },
      {
        id: 'delete',
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete',
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

  onPaginatorAction(selectedRows: unknown[]) {
    if (!selectedRows.length) return;
  }

  sortData(sortParameters: Sort) {
    const keyName = sortParameters.active;
    console.log(keyName);

    // if (sortParameters.direction === 'asc') {
    //   this.tableData = this.tableData.sort((a: TableData, b: TableData) =>
    //     a![keyName as keyof TableData] > b![keyName as keyof TableData] ? 1 : -1
    //   );
    // } else if (sortParameters.direction === 'desc') {
    //   this.tableData = this.tableData.sort((a: TableData, b: TableData) =>
    //     a![keyName as keyof TableData] < b![keyName as keyof TableData] ? 1 : -1
    //   );
    // }
  }
}
