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

  viewUserReport(user: any): void {
    this.router.navigate(['/admin-home/user-report', user._id]);
  }

  pageChanged(event: any) {
    this.p = event;
  }

  exportToCSV(): void {
    const headers = ['#', 'Name', 'Mobile', 'City', 'Email', 'Joined Date'];
    const rows = this.filteredList.map((u: any, i: number) => [
      i + 1,
      u.name || '',
      u.mobile || '',
      u.city || '',
      u.email || '',
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
