import { BreakPointHelper } from '../../../../core/helpers/breakpoint.helper';
import { TableAction, TableColumn, PaginatorAction } from './../../../../shared/components/table/table.component';
import { Sort } from '@angular/material/sort';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AccordionData } from 'src/app/shared/components/accordion/accordion.component';


type TableData = Partial<unknown | undefined>;

@Component({
  selector: 'newtone-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {

  tableData: TableData[] = [];

  tableRowActions!: TableAction<unknown>[];

  tableColumns: TableColumn[] = [];

  tablePaginatorAction: PaginatorAction = {};

  accordionData: AccordionData[] = [
    {
      title: "Classical",
      description: " not classcial",
      actions: [
        {
          text: "edit",
          event: () => {
            console.log("edited")
          }
        }
      ]
    }
  ]

  constructor(
    public mediaQuery: BreakPointHelper,
  ) {
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
        tooltip: 'Edit any',
        action: (item) => {
          console.log(item);
        },
      },
      {
        id: 'delete',
        icon: 'delete',
        color: 'warn',
        tooltip: 'Delete any',
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
