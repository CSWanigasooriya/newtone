/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface TableAction<T> {
  id: string;
  icon: string;
  color?: 'primary' | 'accent' | 'warn' | undefined;
  tooltip: string;
  action?: (item?: T) => void;
}

export interface TableColumn {
  name: string; // column name
  dataKey: string; // name of key of the actual data in this column
  position?: 'right' | 'left'; // should it be right-aligned or left-aligned?
  isSortable?: boolean; // can a column be sorted?
}

export type TableData<T> = {
  data: T[];
};

export interface PaginatorAction {
  text?: string;
  icon?: string;
  style?:
    | 'mat-raised-button'
    | 'mat-stroked-button'
    | 'mat-flat-button'
    | 'mat-icon-button'
    | 'mat-fab'
    | 'mat-mini-fab';
  color?: 'primary' | 'accent' | 'warn';
  count?: boolean;
}
@Component({
  selector: 'newtone-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  public tableDataSource!: MatTableDataSource<unknown>;
  public displayedColumns!: string[];

  isLoading = true;
  isRateLimitReached = false;
  resultsLength = 0;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;

  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() isSelectable = false;
  @Input() tableColumns: TableColumn[] = [];
  @Input() stickyHeader = false;
  @Input() paginatorActionButton: PaginatorAction | null = null;
  @Input() rowActionButtons!: TableAction<any>[];
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() paginatorAction: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: unknown[]) {
    this.selection.clear();
    this.setTableDataSource(data);
  }

  ngOnInit(): void {
    const columnNames = this.tableColumns.map(
      (tableColumn: TableColumn) => tableColumn.name
    );
    if (this.rowActionButtons) {
      this.displayedColumns = [
        ...columnNames,
        'actions',
        // ...this.rowActionButtons.map((action) => action.name),
      ];
    } else {
      this.displayedColumns = columnNames;
    }

    this.isSelectable ? this.displayedColumns.unshift('select') : null;
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
  }

  setTableDataSource(data: unknown[]) {
    this.tableDataSource = new MatTableDataSource<unknown>(data);
    this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
    if (data.length > 0) {
      this.isLoading = false;
    } else {
      setTimeout(() => {
        this.isLoading = false;
        this.isRateLimitReached = true;
      }, 4000);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  emitPaginatorAction() {
    this.paginatorAction.emit(this.selection.selected);
    this.selection.clear();
  }

  emitAction(instance: TableAction<any> | undefined, element: any) {
    instance?.action ? instance.action(element) : null;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.tableDataSource.data);
    this.selectionChange.emit(this.selection.selected);
  }

  toggleOneRow(row: unknown) {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    const sortBy = this.tableColumns.find(
      (tableColumn: TableColumn) => tableColumn.name === sortParameters.active
    )?.dataKey;
    sortParameters.active = sortBy ? sortBy : sortParameters.active;
    this.sort.emit(sortParameters);
  }
}
