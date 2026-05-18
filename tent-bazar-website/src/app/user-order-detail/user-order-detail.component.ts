import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-order-detail.component.html',
  styles: []
})
export class UserOrderDetailComponent implements OnInit {
  order: any = null;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.order = this.dataService.selectedOrder;
    if (!this.order) {
      this.router.navigate(['/my-orders']);
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'TO-DO': 'bg-gray-500',
      'In-progress': 'bg-yellow-500',
      'Done': 'bg-green-500',
      'Cancle': 'bg-red-500',
      'Hold': 'bg-orange-500'
    };
    return map[status] || 'bg-gray-400';
  }

  goBack() {
    this.router.navigate(['/my-orders']);
  }
}
