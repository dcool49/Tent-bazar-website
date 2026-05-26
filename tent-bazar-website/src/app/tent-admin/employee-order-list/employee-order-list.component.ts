import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-order-list',
  standalone: false,
  templateUrl: './employee-order-list.component.html',
  styleUrl: './employee-order-list.component.scss',
})
export class EmployeeOrderListComponent implements OnInit {
  orderData: any[] = [];
  allOrderData: any[] = [];
  statusList = ['TO-DO', 'In-progress', 'Done', 'Cancle', 'Hold'];
  StatusValue = '';
  searchCustomer = '';
  fromDate = '';
  toDate = '';
  dateFilterEnabled = true;
  loading = true;

  private employeeId = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    this.employeeId = user._id || '';
    this.setDefaultDateRange();
    this.fetchOrders();
  }

  setDefaultDateRange() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.fromDate = this.formatDate(firstDay);
    this.toDate = this.formatDate(now);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  buildPayload(): any {
    const payload: any = { empId: this.employeeId };
    if (this.StatusValue) payload['status'] = this.StatusValue;
    if (this.dateFilterEnabled && (this.fromDate || this.toDate)) {
      payload['createdAt'] = {};
      if (this.fromDate) payload['createdAt']['$gte'] = this.fromDate;
      if (this.toDate) payload['createdAt']['$lte'] = this.toDate;
    }
    return payload;
  }

  fetchOrders() {
    this.loading = true;
    this.dataService.postAPICall('order/fetch', this.buildPayload()).subscribe({
      next: (res: any) => {
        this.allOrderData = res.data || [];
        this.applyClientSearch();
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  onFilterChange() {
    this.fetchOrders();
  }

  toggleDateFilter() {
    this.dateFilterEnabled = !this.dateFilterEnabled;
    this.fetchOrders();
  }

  applyClientSearch() {
    if (!this.searchCustomer) {
      this.orderData = this.allOrderData;
      return;
    }
    const search = this.searchCustomer.toLowerCase();
    this.orderData = this.allOrderData.filter((order: any) =>
      order.buyerId?.name?.toLowerCase().includes(search)
    );
  }

  clearFilter() {
    this.StatusValue = '';
    this.searchCustomer = '';
    if (this.dateFilterEnabled) this.setDefaultDateRange();
    this.fetchOrders();
  }

  get hasActiveFilter(): boolean {
    return !!(this.StatusValue || this.searchCustomer);
  }

  viewOrder(order: any) {
    this.dataService.selectedOrder = order;
    this.router.navigate(['/admin-home/view-order']);
  }
}
