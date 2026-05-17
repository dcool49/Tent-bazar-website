import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { DataService } from '../services/data.service';
import { inject } from '@angular/core';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const dataService = inject(DataService);
  dataService.showLoader();

  const token = localStorage.getItem('token') ||
    JSON.parse(localStorage.getItem('adminUser') || 'null')?.token;
    console.log("token",token)
  if (token) {
    req = req.clone({ setHeaders: { authorization: `beerer ${token}` } });
  }

  return next(req).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        dataService.hideLoader();
      }
    }),
    catchError(err => {
      dataService.hideLoader();
      return throwError(() => err);
    })
  );
};
