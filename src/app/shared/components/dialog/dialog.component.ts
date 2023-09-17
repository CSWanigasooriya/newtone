import { ComponentType } from '@angular/cdk/portal';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogTemplateService } from '../../services/dialog-template.service';
export interface DialogData<T> {
  title: string;
  subtitle: string;
  description: string;
  actions?: DialogAction<T>[];
  template?: ComponentType<unknown>;
}

export interface DialogAction<T> {
  text?: string;
  icon?: string;
  action: (data?: T) => boolean;
  style?:
    | 'mat-raised-button'
    | 'mat-stroked-button'
    | 'mat-flat-button'
    | 'mat-icon-button'
    | 'mat-fab'
    | 'mat-mini-fab';
  color?: 'primary' | 'accent' | 'warn';
}
@Component({
  selector: 'newtone-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(
    private _dialogTemplateService: DialogTemplateService,
    private _matDialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<unknown>
  ) {}

  public closeDialog(event?: DialogAction<unknown>): void {
    event?.action
      ? this._matDialogRef.close(
          event?.action(this._dialogTemplateService.updateValue.value)
        )
      : this._matDialogRef.close();
  }
}
