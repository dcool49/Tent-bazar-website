import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  imports: [],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss'
})
export class ThankYouComponent {
  orderId: string | null = null;

  constructor(private route: Router){
    this.orderId = localStorage.getItem('orderId');
    localStorage.removeItem('orderId');
  }

  gotoHome(){
    this.route.navigate(['/','home'])
  }
}
