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
  orderData:any;
  constructor(private dataService: DataService,private route:Router){}
  ngOnInit(): void {
    this.getOrderDetails();
  }

getOrderDetails(){
  const url='order/fetch';
  this.dataService.getAPICall(url).subscribe((res:any)=>{
    this.orderData = res.data;
  });
}

viewOrder(order:any){
  this.dataService.selectedOrder = order;
  this.route.navigate(['/admin-home/','view-order'])
}

}
