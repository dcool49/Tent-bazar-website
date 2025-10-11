import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  imports: [],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss'
})
export class ThankYouComponent {
constructor(private route: Router){}

gotoHome(){
  this.route.navigate(['/','home'])
}

}
