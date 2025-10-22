import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-admin-view-order',
  standalone:false,
  templateUrl: './admin-view-order.component.html',
  styleUrl: './admin-view-order.component.scss'
})
export class AdminViewOrderComponent implements OnInit {
  orderData:any;
  constructor(private dataService: DataService){}
  ngOnInit(): void {
    console.log("order",this.dataService.selectedOrder)
    if(!this.dataService.selectedOrder){
      window.history.back();
    }

  }

}
