import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-orders.component.html',
  styles: []
})
export class UserOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;
  userId = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    const savedData = JSON.parse(localStorage.getItem('enquiryUserData') || 'null');
    if (!savedData?.userId) {
      this.router.navigate(['/enquiry']);
      return;
    }
    this.userId = savedData.userId;
    this.fetchOrders();
  }

  fetchOrders() {
    this.dataService.postAPICall('order/fetch',{'buyerId':this.userId}).subscribe(
      (res: any) => {
        const all = res.data || [];
        this.orders = all.filter(
          (o: any) => o.buyerId?._id === this.userId || o.buyerId === this.userId
        );
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    );
  }

  viewOrder(order: any) {
    this.dataService.selectedOrder = order;
    this.router.navigate(['/order-detail']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
