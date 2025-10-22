import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { DataService } from '../services/data.service';
import { inject } from '@angular/core';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const dataService = inject(DataService);
  dataService.showLoader();
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      dataService.hideLoader();
    }else{
      dataService.hideLoader(); 
    }
  }));
};
