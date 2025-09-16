import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(http:HttpClient) { 
    this.getDataList(){
      const url='http://13.233.41.105'
    }
  }
  getDataService(){
    return[
      {name:'mobile',brand:'samsung',price:2000},
      {name:'laptop',brand:'hp',price:20000},
      {name:'watch',brand:'nokia',price:200},
    ]
  }
}
