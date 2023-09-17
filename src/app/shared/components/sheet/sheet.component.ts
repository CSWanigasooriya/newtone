import { Component, Inject } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

export interface SheetData {
  names: string[];
}

@Component({
  selector: 'newtone-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: SheetData
  ) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
