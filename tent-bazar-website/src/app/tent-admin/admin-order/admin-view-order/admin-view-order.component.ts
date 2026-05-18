import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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
  isAdmin = localStorage.getItem('role') === 'admin';
  showAddProduct = false;
  productSearch = '';
  productSearchResults: any[] = [];
  searchingProducts = false;

  constructor(public dataService: DataService,public dialog: MatDialog,private route: Router,private location: Location){
    if(this.dataService.selectedOrder){
      this.employeeId = this.dataService.selectedOrder?.empId?._id || '';
      this.selectedStatus = this.dataService.selectedOrder.status;
      this.getCatList();
    }
  }
  ngOnInit(): void {
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
      this.selectedID = prod.productId._id;
      const dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
        width: '500px',
        data: {
          heading: 'Delete Product',
          msg: 'Are you sure you want to delete',
          name: prod.productId.productName,
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
      localStorage.setItem('productId', prod.productId._id);
      const dialogRef = this.dialog.open(ProductDetailsComponent, {
        width: '90vw',
        maxWidth: '900px',
        data: { adminView: true },
      });

      dialogRef.afterClosed().subscribe((result) => {
      });
    }
    goBack() {
      this.location.back();
    }

    urlRout(path: any) {
      this.route.navigate(['/admin-home/' + path])
    }
 
    getorder() {
      const url = 'order/fetch';
      const payload = { _id: this.dataService.selectedOrder._id };
      this.dataService.postAPICall(url, payload).subscribe({
        next: (res: any) => {
          this.orderData = res.data[0];
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

orderUpdate(){
  const payload={
    _id:this.orderData._id,
    empId:this.employeeId,
    productDetails: this.orderData.productDetails,
    status:this.selectedStatus
  }
  const url = 'order/update';
  this.dataService.patchApiCall(url,payload).subscribe(
    (res: any) => {
     this.goBack()
    },
    (err) => {
      console.error(err);
    }
  )
}

downloadPdf() {
  window.print();
}

toggleAddProduct() {
  this.showAddProduct = !this.showAddProduct;
  if (!this.showAddProduct) {
    this.productSearch = '';
    this.productSearchResults = [];
  }
}

private debounceTimer: any;
onProductSearch() {
  clearTimeout(this.debounceTimer);
  if (!this.productSearch.trim()) {
    this.productSearchResults = [];
    return;
  }
  this.debounceTimer = setTimeout(() => {
    this.searchingProducts = true;
    const url = 'product/fetch?search=' + encodeURIComponent(this.productSearch.trim());
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => {
        this.productSearchResults = res.data || [];
        this.searchingProducts = false;
      },
      error: () => {
        this.searchingProducts = false;
      }
    });
  }, 350);
}

addProductToOrder(prod: any) {
  const alreadyAdded = this.orderData.productDetails?.some(
    (p: any) => p.productId?._id === prod._id
  );
  if (!alreadyAdded) {
    this.orderData.productDetails.push({ productId: prod, quantity: 1 });
  }
  this.showAddProduct = false;
  this.productSearch = '';
  this.productSearchResults = [];
}

increaseQty(prod: any) {
  prod.quantity = (prod.quantity || 1) + 1;
}

decreaseQty(prod: any) {
  if ((prod.quantity || 1) > 1) {
    prod.quantity = prod.quantity - 1;
  }
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
