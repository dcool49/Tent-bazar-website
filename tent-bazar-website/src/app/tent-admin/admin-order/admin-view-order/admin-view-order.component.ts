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
  constructor(public dataService: DataService,public dialog: MatDialog,private route: Router,){}
  ngOnInit(): void {
    console.log("order",this.dataService.selectedOrder)
    if(!this.dataService.selectedOrder){
      window.history.back();
    }else{
      this.getCatList();
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


    openDialog(prod: any): void {
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
          this.deleteProduct(this.selectedID);
        }
      });
    }
  deleteProduct(selectedID: any) {
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


}
