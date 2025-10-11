import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';

declare function initFlowbite(): void;
@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  imports: [NgFor]
})
export class HeroSectionComponent implements OnInit, AfterViewInit {
  bannerData:any;
   // Use a flag to ensure the carousel is initialized only once after data is ready
   private carouselInitialized = false; 
constructor(private dataService:DataService){}

  ngOnInit(): void {
    this.getBanner();
  }
  getBanner(){
    const url='banner/fetch'
    this.dataService.getAPICall(url).subscribe((res:any)=>{
      this.bannerData = res.data;
       // ✅ Set flag to allow initialization in ngAfterViewInit
       this.carouselInitialized = false; 
    },(err)=>{
      console.error(err);
    })
  }

  ngAfterViewInit(): void {
    // Check if data is available and the carousel hasn't been initialized yet
    if (this.bannerData && this.bannerData.length > 0 && !this.carouselInitialized) {
      // Flowbite's function to scan the DOM and initialize all components
      // This function needs to be available globally (loaded via <script> tag)
      if (typeof initFlowbite === 'function') {
        initFlowbite();
        this.carouselInitialized = true;
      } 
      // If `initFlowbite` doesn't work, you might need to target the specific element:
      /*
      else if (typeof document !== 'undefined') {
        const carouselElement = document.getElementById('default-carousel');
        if (carouselElement) {
          // Initialize the specific carousel instance (requires Flowbite JS to be loaded)
          // new Carousel(carouselElement, items, options, instanceOptions);
        }
      }
      */
    }
  }
}
