import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit {
  bannerData:any;
constructor(private dataService:DataService){}
  ngOnInit(): void {
    this.getBanner();
  }
  getBanner(){
    const url='banner/fetch'
    this.dataService.getAPICall(url).subscribe((res)=>{
      this.bannerData = res;
    },(err)=>{
      console.error(err);
    })
  }
}
