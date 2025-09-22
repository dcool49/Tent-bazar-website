import { Component } from '@angular/core';
import { AdminSidenavComponent } from '../admin-sidenav/admin-sidenav.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-home',
  imports: [
    AdminSidenavComponent,
    AdminDashboardComponent
  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {

}
