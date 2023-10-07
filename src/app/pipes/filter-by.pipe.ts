/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
})
export class FilterByPipe implements PipeTransform {
  transform(items: any[], filter: Record<string, any>): any {
    if (!items || !filter) {
      return items;
    }

    const key = Object.keys(filter)[0];
    const value = filter[key];

    return items.filter((e) => e[key].indexOf(value) !== -1);
  }
}
