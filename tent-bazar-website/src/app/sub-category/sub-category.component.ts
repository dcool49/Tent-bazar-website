import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-category',
  imports: [],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss'
})
export class SubCategoryComponent {
constructor(private route: Router) { }
  urlRout(path: any) {
    this.route.navigate(['/' + path])
  }
}
