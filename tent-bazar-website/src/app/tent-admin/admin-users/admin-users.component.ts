import { Component } from '@angular/core';
import { AdminEmployeeComponent } from '../admin-employee/admin-employee.component';
import { AddAdminUserComponent } from './add-admin-user/add-admin-user.component';

@Component({
  selector: 'app-admin-users',
  standalone:false,
    templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent extends AdminEmployeeComponent {
  override role = 'user';
  override getListUrl = 'user/fetch?role=user&passwordToShow=true';
  override addComponent = AddAdminUserComponent as any;
  p: number = 1;
  itemsPerPage: number = 10;
  value: any = '';
  searchQuery: string = '';

  get filteredList(): any[] {
    if (!this.List) return [];
    const sorted = [...this.List].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return sorted;
    return sorted.filter((u: any) =>
      [u.name, u.mobile, u.city, u.email].some(
        (field) => field && String(field).toLowerCase().includes(q)
      )
    );
  }

  pageChanged(event: any) {
    this.p = event;
  }
}
