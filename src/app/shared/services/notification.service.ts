import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  public showNotification(
    message: string = '',
    action: string = 'OK',
    duration: number = 3000
  ): void {
    this._snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mat-toolbar', 'mat-primary'],
    });
  }

  public showError(
    error: { code: string; message: string },
    action: string = 'OK',
    duration: number = 3000
  ) {
    this._snackBar.open(error.message ? error.message : '', action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mat-toolbar', 'mat-warn'],
    });
  }
}
