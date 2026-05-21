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
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
  standalone:false,
})
export class AdminHomeComponent implements OnInit ,OnDestroy {
activeTab = 0;
isSidebarOpen = false;
role = localStorage.getItem('role') || 'employee';
isAdmin = this.role === 'admin';
private routerSub!: Subscription;
constructor(private route:Router, private authService:AuthService){}

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}

  allTabs: { label: string; icon: string; route: string; roles: string[] }[] = [
    { label: 'Dashboard',    icon: 'bi bi-speedometer2',  route: 'Dashboard',         roles: ['admin'] },
    { label: 'My Dashboard', icon: 'bi bi-speedometer2',  route: 'EmployeeDashboard', roles: ['employee'] },
    { label: 'Orders',       icon: 'bi bi-box-seam',      route: 'Orders',            roles: ['admin'] },
    { label: 'My Orders',    icon: 'bi bi-box-seam',      route: 'EmployeeOrders',    roles: ['employee'] },
    { label: 'Users',        icon: 'bi bi-people',        route: 'Users',             roles: ['admin', 'employee'] },
    { label: 'Products',     icon: 'bi bi-bag',           route: 'Products',          roles: ['admin', 'employee'] },
    { label: 'Category',     icon: 'bi bi-grid',          route: 'Category',          roles: ['admin', 'employee'] },
    { label: 'Employees',    icon: 'bi bi-person-badge',  route: 'Employees',         roles: ['admin'] },
    { label: 'YouTube',      icon: 'bi bi-youtube',       route: 'YouTube',           roles: ['admin'] },
    { label: 'Instagram',    icon: 'bi bi-instagram',     route: 'Instagram',         roles: ['admin'] },
    { label: 'banner',       icon: 'bi bi-image',         route: 'banner',            roles: ['admin'] },
  ];

  get tabs() {
    return this.allTabs.filter(tab => tab.roles.includes(this.role));
  }

  setTab(i: number) {
    this.activeTab = i;
  }
  urlRout(route: string) {
    this.route.navigate(['/admin-home/' + route]);
  }

  remainingTime: number = 12 * 60 * 60; // 24 hours in seconds
  intervalId: any;

  private syncActiveTabFromUrl(url: string): void {
    const segment = url.split('/').pop()?.split('?')[0] || '';
    const filteredTabs = this.tabs;
    const idx = filteredTabs.findIndex(
      t => t.route.toLowerCase() === segment.toLowerCase()
    );
    if (idx !== -1) this.activeTab = idx;
  }

  ngOnInit(): void {
    this.startTimer();
    this.syncActiveTabFromUrl(this.route.url);
    this.routerSub = this.route.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this.syncActiveTabFromUrl(e.urlAfterRedirects));
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.authService.logout();
        clearInterval(this.intervalId);
        this.route.navigate(['/admin-login'])
      }
    }, 1000); // Update every 1 second
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.routerSub?.unsubscribe();
  }

}
