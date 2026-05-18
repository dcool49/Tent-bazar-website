import { Component, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.setPage({
      title: 'About Us',
      description: 'Learn about Aditya Agency & Tent Bazar – your trusted supplier for premium tents and event supplies across India.',
      path: '/about-us',
      keywords: 'about tent bazar, aditya agency, tent supplier India'
    });
  }
}
