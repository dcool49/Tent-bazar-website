import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 add this
import { AdminTopNavComponent } from '../admin-top-nav/admin-top-nav.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AdminOrderComponent } from '../admin-order/admin-order.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminEmployeeComponent } from '../admin-employee/admin-employee.component';
import { AdminProductsComponent } from '../admin-products/admin-products.component';
import { AdminCategoryComponent } from '../admin-category/admin-category.component';
import { AdminYoutubeUrlComponent } from '../admin-youtube-url/admin-youtube-url.component';
import { AdminInstagramUrlComponent } from '../admin-instagram-url/admin-instagram-url.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
  standalone:false,
})
export class AdminHomeComponent implements OnInit ,OnDestroy {
activeTab = 0;
constructor(private route:Router, private authService:AuthService){}
  tabs = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Orders', icon: '📦' },
    { label: 'Users', icon: '👤' },
    { label: 'Employees', icon: '👨‍💼' },
    { label: 'Products', icon: '🛒' },
    { label: 'Category', icon: '🗂️' },
    { label: 'YouTube', icon: '🎥' },
    { label: 'Instagram', icon: '📸' },
    { label: 'banner', icon:'🖼️'}
  ];

  setTab(i: number) {
    this.activeTab = i;
  }
  urlRout(path: any) {
    this.route.navigate(['/admin-home/' + path])
  }

  remainingTime: number = 12 * 60 * 60; // 24 hours in seconds
  intervalId: any;

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.authService.logout();
        clearInterval(this.intervalId);
        console.log('Timer finished!');
        this.route.navigate(['/admin-login'])
      }
    }, 1000); // Update every 1 second
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear interval on component destruction
  }

}
