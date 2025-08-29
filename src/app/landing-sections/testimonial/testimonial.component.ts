import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliceGroupsPipe } from '../../pipes/slice-groups-pipe';

@Component({
  selector: 'app-testimonial',
  imports: [
    CommonModule,
    SliceGroupsPipe
  ],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.scss'
})
export class TestimonialComponent {
currentIndex = 0;

  testimonials = [
    {
      name: 'Priya Sharma',
      role: 'User',
      quote: 'The team made our wedding unforgettable. The tent setup, flowers, and decorations were beyond perfect—everyone was amazed!',
      img: 'assets/images/logo.png'
    },
    {
      name: 'Rahul Mehta',
      role: 'User',
      quote: 'From sofas to catering items, everything was arranged so beautifully. They really took the stress out of planning our reception.',
      img: 'assets/images/logo.png'
    },
    {
      name: 'Anita Desai',
      role: 'User',
      quote: 'The tent was stunning, and the floral arrangements were exquisite. Our guests couldn\'t stop complimenting the decor!',
      img: 'assets/images/logo.png'
    },
    {
      name: 'Vikram Singh',
      role: 'User',
      quote: 'The attention to detail was incredible. The tent, flowers, and overall setup created a magical atmosphere for our special day.',
      img: 'assets/images/logo.png'
    },
    {
      name: 'Sneha Kapoor',
      role: 'User',
      quote: 'They transformed our venue into a fairy tale setting. The tent and decorations were absolutely breathtaking!',
      img: 'assets/images/logo.png'
    },
    {
      name: 'Amit Joshi',
      role: 'User',
      quote: 'The team was professional and creative. Our wedding tent looked like something out of a dream, and we couldn\'t be happier!',
      img: 'assets/images/logo.png'
    }
    
    
  ];

  nextSlide() {
    const totalGroups = Math.ceil(this.testimonials.length / 3);
    this.currentIndex = (this.currentIndex + 1) % totalGroups;
  }

  prevSlide() {
    const totalGroups = Math.ceil(this.testimonials.length / 3);
    this.currentIndex = (this.currentIndex - 1 + totalGroups) % totalGroups;
  }
}
