import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';

declare function initFlowbite(): void;
@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  imports: [NgFor]
})
export class HeroSectionComponent implements OnInit {
  bannerData: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getBanner();
  }

  getBanner() {
    const url = 'banner/fetch';
    this.dataService.getAPICall(url).subscribe((res: any) => {
      this.bannerData = res.data;
      // Wait for *ngFor to render the carousel items, then initialize Flowbite
      setTimeout(() => {
        if (typeof initFlowbite === 'function') {
          initFlowbite();
        }
      }, 0);
    }, (err) => {
      console.error(err);
    });
  }
}
