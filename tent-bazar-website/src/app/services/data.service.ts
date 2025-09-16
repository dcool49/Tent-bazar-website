import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = 'http://ec2-13-233-41-105.ap-south-1.compute.amazonaws.com:4500/api/';

  constructor(private http: HttpClient) {}

  getAPICall(url: any) {
    return this.http.get(this.baseUrl + url);
  }
}
