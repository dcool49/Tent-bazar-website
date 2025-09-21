import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-offer-service',
  imports: [NgFor],
  templateUrl: './offer-service.component.html',
  styleUrl: './offer-service.component.scss'
})
export class OfferServiceComponent implements OnInit {
  category: any;
constructor(private route: Router,private dataService:DataService) { }
  ngOnInit(): void {
    this.getCatList();
  }
  urlRout(path: any,category: any) {
    localStorage.setItem("catId",category._id);
    localStorage.setItem("catName",category.categoryName);
    this.route.navigate(['/' + path])
  }
  getCatList(){
    const url = 'category/fetch'
    this.dataService.getAPICall(url).subscribe((res:any)=>{
      this.category = res.data;
    },(err)=>{
      console.error(err);
    })
  }
}
