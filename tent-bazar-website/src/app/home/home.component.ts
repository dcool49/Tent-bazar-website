import { Component, OnInit } from '@angular/core';
import { OfferServiceComponent } from '../landing-sections/offer-service/offer-service.component';
import { HeroSectionComponent } from '../landing-sections/hero-section/hero-section.component';
import { MobileSectionComponent } from '../landing-sections/mobile-section/mobile-section.component';
// import { TabServiceSectionComponent } from '../landing-sections/tab-service-section/tab-service-section.component';
// import { TestimonialComponent } from '../landing-sections/testimonial/testimonial.component';
import { FindSectionComponent } from '../landing-sections/find-section/find-section.component';
import { ReelsSectionComponent } from '../landing-sections/reels-section/reels-section.component';
import { YoutubeSectionComponent } from '../landing-sections/youtube-section/youtube-section.component';
import { SeoService } from '../services/seo.service';

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
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.setPage({
      title: 'Premium Tents & Event Supplies',
      description: 'Buy quality tents, side walls, catering equipment and event supplies at Aditya Agency & Tent Bazar. Fast delivery across India.',
      path: '/',
      keywords: 'tent bazar, event tent, catering tent, party tent, side wall, tent accessories India',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'Aditya Agency & Tent Bazar',
        url: 'https://tentbazaar.in',
        logo: 'https://tentbazaar.in/assets/images/logo.svg',
        description: 'Premium tent and event supplies dealer in India'
      }
    });
  }
}
