import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = 'http://ec2-13-233-41-105.ap-south-1.compute.amazonaws.com:4500/api/';

  private apiCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
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
