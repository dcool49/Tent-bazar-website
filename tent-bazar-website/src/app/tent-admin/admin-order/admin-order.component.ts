import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-order',
  standalone:false,
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.scss'
})
export class AdminOrderComponent implements OnInit {
  orderData: any;
  allOrderData: any;
  statusList = ['TO-DO', 'In-progress', 'Done', 'Cancle', 'Hold'];
  employeeList: any;
  employeeId: any;
  StatusValue: any;
  searchCustomer: any;
  fromDate: string = '';
  toDate: string = '';
  dateFilterEnabled: boolean = false;

  constructor(private dataService: DataService, private route: Router) {}

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.getOrderDetails(this.buildPayload());
    this.getemployeeList();
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
    const payload: any = {};
    if (this.employeeId) payload['employeeId'] = this.employeeId;
    if (this.StatusValue) payload['status'] = this.StatusValue;
    if (this.dateFilterEnabled && this.fromDate) payload['fromDate'] = this.fromDate;
    if (this.dateFilterEnabled && this.toDate) payload['toDate'] = this.toDate;
    return payload;
  }

  toggleDateFilter() {
    this.dateFilterEnabled = !this.dateFilterEnabled;
    this.getOrderDetails(this.buildPayload());
  }

  getOrderDetails(payload: any = {}) {
    const url = 'order/fetch';
    this.dataService.postAPICall(url, payload).subscribe((res: any) => {
      this.allOrderData = res.data;
      this.applyClientSearch();
    });
  }

  viewOrder(order: any) {
    this.dataService.selectedOrder = order;
    this.route.navigate(['/admin-home/', 'view-order']);
  }

  getemployeeList() {
    const url = 'user/v2/fetch?role=employee';
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => {
        this.employeeList = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  get hasActiveFilter(): boolean {
    return !!(this.employeeId || this.StatusValue || this.searchCustomer);
  }

  onFilterChange() {
    this.getOrderDetails(this.buildPayload());
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
    this.employeeId = '';
    this.StatusValue = '';
    this.searchCustomer = '';
    if (this.dateFilterEnabled) this.setDefaultDateRange();
    this.getOrderDetails(this.buildPayload());
  }
}
