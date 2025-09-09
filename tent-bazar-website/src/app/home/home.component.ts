import { Component } from '@angular/core';
import { OfferServiceComponent } from '../landing-sections/offer-service/offer-service.component';
import { HeroSectionComponent } from '../landing-sections/hero-section/hero-section.component';
import { MobileSectionComponent } from '../landing-sections/mobile-section/mobile-section.component';
// import { TabServiceSectionComponent } from '../landing-sections/tab-service-section/tab-service-section.component';
// import { TestimonialComponent } from '../landing-sections/testimonial/testimonial.component';
import { FindSectionComponent } from '../landing-sections/find-section/find-section.component';
import { ReelsSectionComponent } from '../landing-sections/reels-section/reels-section.component';
import { YoutubeSectionComponent } from '../landing-sections/youtube-section/youtube-section.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    OfferServiceComponent,
    MobileSectionComponent,
    // TabServiceSectionComponent,
    // TestimonialComponent,
    FindSectionComponent,
    ReelsSectionComponent,
    YoutubeSectionComponent,
  ], // 👈 add here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
