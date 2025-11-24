import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  baseUrl = 'https://tentbazaar.in/api/';

  private apiCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  userDetails: any;
  selectedOrder: any;
  constructor(private http: HttpClient) {}

  getAPICall(url: any) {
    return this.http.get(this.baseUrl + url);
  }
  postAPICall(url:any,payload:any){
    return this.http.post(this.baseUrl+url,payload);
  }
  deleteAPICall(url:any){
    return this.http.delete(this.baseUrl+url);
  }
  putAPICall(url:any,payload:any){
    return this.http.put(this.baseUrl+url,payload);
  }

  patchApiCall(url: string, payload: any) {
    return this.http.patch(this.baseUrl+url,payload);
  }

  showLoader() {
    if (this.apiCount === 0) {
      this.isLoadingSubject.next(true);
    }
    this.apiCount++;
  }

  hideLoader() {
    this.apiCount--;
    if (this.apiCount === 0) {
      this.isLoadingSubject.next(false);
    }
  }
}
