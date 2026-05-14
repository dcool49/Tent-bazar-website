import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-footer',
  imports: [NgFor],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  categories: any[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAPICall('category/fetch').subscribe({
      next: (res: any) => { this.categories = res.data; },
      error: (err) => { console.error(err); }
    });
  }

  navigateToCategory(category: any) {
    localStorage.setItem('catId', category._id);
    localStorage.setItem('catName', category.categoryName);
    this.router.navigate(['/sub-category']);
  }
}
