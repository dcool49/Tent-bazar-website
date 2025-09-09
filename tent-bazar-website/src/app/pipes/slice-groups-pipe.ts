import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceGroups',
  standalone: true
})
export class SliceGroupsPipe implements PipeTransform {
  transform<T>(array: T[], size: number): T[][] {
    if (!array || size <= 0) return [];
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}
