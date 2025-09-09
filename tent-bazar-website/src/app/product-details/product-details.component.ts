import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
constructor(private route: Router) { }
  urlRout(path: any) {
    this.route.navigate(['/' + path])
  }
}
