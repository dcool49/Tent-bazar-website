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
  statusList =['TO-DO','In-progress','Done','Cancle','Hold'];
  employeeList: any;
  employeeId:any;
  StatusValue:any;
  constructor(private dataService: DataService,private route:Router){}
  ngOnInit(): void {
    this.getOrderDetails();
    this.getemployeeList();
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

getemployeeList(){
  const url = 'user/v2/fetch?role=employee';
  this.dataService.getAPICall(url).subscribe(
    (res:any) => {
      this.employeeList = res.data;
    },
    (err) => {
      console.error(err);
    }
  );
}
applyFilyer(){

}
}
