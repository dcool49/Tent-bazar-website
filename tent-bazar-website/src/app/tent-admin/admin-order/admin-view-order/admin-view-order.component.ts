import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteConfirmModalComponent } from '../../../data-model/delete-confirm-modal/delete-confirm-modal.component';
import { ProductDetailsComponent } from '../../../product-details/product-details.component';

@Component({
  selector: 'app-admin-view-order',
  standalone:false,
  templateUrl: './admin-view-order.component.html',
  styleUrl: './admin-view-order.component.scss'
})
export class AdminViewOrderComponent implements OnInit {
  orderData:any;
  category: any;
  selectedID: any;
  employeeList: any;
  employeeId:any;
  statusList =['TO-DO','In-progress','Done','Cancle','Hold'];
  selectedStatus:any;
  constructor(public dataService: DataService,public dialog: MatDialog,private route: Router,){
    if(this.dataService.selectedOrder){
      this.employeeId = this.dataService.selectedOrder?.empId?._id;
      this.selectedStatus = this.dataService.selectedOrder.status;
      this.getCatList();
    }
  }
  ngOnInit(): void {
    console.log("order",this.dataService.selectedOrder)
    if(!this.dataService.selectedOrder){
      window.history.back();
    }else{
      this.getorder();
      this.getemployeeList();
    }

  }

  getCatList() {
    const url = 'category/fetch';
    this.dataService.getAPICall(url).subscribe(
      (res: any) => {
        this.category = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getcatName(id: any): String {
    if (this.category.length > 1) {
      const index = this.category.findIndex((val: any) => id === val._id);
      if (index !== -1) {
        return this.category[index]?.categoryName;
      } else {
        return '-';
      }
    } else {
      return '-';
    }
  }


    openDialog(prod: any,index:number): void {
      this.selectedID = prod._id;
      const dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
        width: '500px',
        data: {
          heading: 'Delete Product',
          msg: 'Are you sure you want to delete',
          name: prod.productName,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.deleteProduct(this.selectedID,index);
        }
      });
    }
  deleteProduct(selectedID: any,i:number) {
    this.orderData.productDetails.splice(i, 1);
  }
  
    openViewDialog(prod: any): void {
      localStorage.setItem('productId', prod._id);
      const dialogRef = this.dialog.open(ProductDetailsComponent, {});
  
      dialogRef.afterClosed().subscribe((result) => {
      });
    }
    urlRout(path: any) {
      this.route.navigate(['/admin-home/' + path])
    }
 
    getorder() {
      const url = 'order/fetch?_id='+this.dataService.selectedOrder._id;
      this.dataService.getAPICall(url).subscribe(
        (res: any) => {
          this.orderData = res.data[0];
          console.log("order",res.data)
        },
        (err) => {
          console.error(err);
        }
      );
    }

orderUpdate(){
  const payload={
    _id:this.orderData._id,
    empId:this.employeeId,
    productDetails: this.orderData.productDetails,
    status:this.selectedStatus
  }
  console.log("payload",payload);
  const url = 'order/update';
  this.dataService.patchApiCall(url,payload).subscribe(
    (res: any) => {
     this.urlRout('Orders')
    },
    (err) => {
      console.error(err);
    }
  )
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

}
