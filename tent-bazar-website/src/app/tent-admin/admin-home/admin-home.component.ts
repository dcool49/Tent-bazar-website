import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 add this
import { AdminTopNavComponent } from '../admin-top-nav/admin-top-nav.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AdminOrderComponent } from '../admin-order/admin-order.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { AdminEmployeeComponent } from '../admin-employee/admin-employee.component';
import { AdminProductsComponent } from '../admin-products/admin-products.component';

@Component({
  selector: 'app-admin-home',
  imports: [
    CommonModule,
    AdminTopNavComponent,
    AdminDashboardComponent,
    AdminOrderComponent,
    AdminUsersComponent,
    AdminEmployeeComponent,
    AdminProductsComponent
  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {
activeTab = 0;

  tabs = [
    { label: 'Dashboard', icon: '📦' },
    { label: 'Orders', icon: '📦' },
    { label: 'Users', icon: '👤' },
    { label: 'Employees', icon: '👨‍💼' },
    { label: 'Products', icon: '🛒' },
  ];

  setTab(i: number) {
    this.activeTab = i;
  }
}
