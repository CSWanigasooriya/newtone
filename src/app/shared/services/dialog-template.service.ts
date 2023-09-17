import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogTemplateService {
  public updateValue = new BehaviorSubject(null);

  updateData(value: never): void {
    this.updateValue.next(value);
  }
}
