import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
constructor(private route:Router){}

  urlRout(path: any) {
    this.route.navigate(['/admin-home/' + path])
  }
}
