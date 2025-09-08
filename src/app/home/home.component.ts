import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { OfferServiceComponent } from '../landing-sections/offer-service/offer-service.component';
import { HeroSectionComponent } from '../landing-sections/hero-section/hero-section.component';
import { MobileSectionComponent } from '../landing-sections/mobile-section/mobile-section.component';
// import { TabServiceSectionComponent } from '../landing-sections/tab-service-section/tab-service-section.component';
// import { TestimonialComponent } from '../landing-sections/testimonial/testimonial.component';
import { FindSectionComponent } from '../landing-sections/find-section/find-section.component';
import { FooterComponent } from '../footer/footer.component';
import { ReelsSectionComponent } from '../landing-sections/reels-section/reels-section.component';
import { YoutubeSectionComponent } from '../landing-sections/youtube-section/youtube-section.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    HeroSectionComponent,
    OfferServiceComponent,
    MobileSectionComponent,
    // TabServiceSectionComponent,
    // TestimonialComponent,
    FindSectionComponent,
    FooterComponent,
    ReelsSectionComponent,
    YoutubeSectionComponent
  ], // 👈 add here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
