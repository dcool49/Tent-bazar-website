import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  imports: [NgFor]
})
export class HeroSectionComponent implements OnInit {
  bannerData:any;
constructor(private dataService:DataService){}
  ngOnInit(): void {
    this.getBanner();
  }
  getBanner(){
    const url='banner/fetch'
    this.dataService.getAPICall(url).subscribe((res:any)=>{
      this.bannerData = res.data;
      console.log("this.bannerData",this.bannerData);
    },(err)=>{
      console.error(err);
    })
  }
}
