import { Component } from '@angular/core';
import { AdminEmployeeComponent } from '../admin-employee/admin-employee.component';

@Component({
  selector: 'app-admin-users',
  standalone:false,
    templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent extends AdminEmployeeComponent {
  override role = 'user';
  override getListUrl = 'user/fetch?role=user';
  p: number = 1; // Current page
  itemsPerPage: number = 10; // Items per page
  value: any = '';

  // Optional: Function to handle page changes
  pageChanged(event: any) {
    this.p = event;
  }
}
