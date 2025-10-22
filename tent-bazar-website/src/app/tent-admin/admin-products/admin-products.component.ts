import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmModalComponent } from '../../data-model/delete-confirm-modal/delete-confirm-modal.component';
import { ProductDetailsComponent } from '../../product-details/product-details.component';
import { AddProductComponent } from './add-product/add-product.component';
@Component({
  selector: 'app-admin-products',
  standalone:false,
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  productList: any;
  searchName = '';
  category: any;
  selectedID: any;
  p: number = 1; // Current page
  itemsPerPage: number = 10; // Items per page

  // Optional: Function to handle page changes
  pageChanged(event: any) {
    this.p = event;
  }
  constructor(
    private route: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {
    this.getCatList();
  }
  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    const url = 'product/fetch?search=' + this.searchName;
    this.dataService.getAPICall(url).subscribe(
      (res: any) => {
        this.productList = res.data;
        this.productList = this.productList.sort((a:any, b:any) =>  {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    
          // For ascending order: dateA.getTime() - dateB.getTime()
          // For descending order: dateB.getTime() - dateA.getTime()
          return  dateB.getTime() - dateA.getTime();
        });
      },
      (err) => {
        console.error(err);
        this.productList = [];
      }
    );
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

  deleteProduct(id: any) {
    const url = 'product/delete?_id=' + id;
    this.dataService.deleteAPICall(url).subscribe(
      (res: any) => {
        console.info(res);
        this.getProductList();
      },
      (err) => {
        console.error(err);
      }
    );
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

  openViewDialog(prod: any): void {
    localStorage.setItem('productId', prod._id);
    const dialogRef = this.dialog.open(ProductDetailsComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  urlRout(path: any) {
    this.route.navigate(['/admin-home/' + path])
  }

    openAddDialog(): void {
      const dialogRef = this.dialog.open(AddProductComponent, {
        width: '500px',
        data: {
          category: this.category
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getProductList();
        }
      });
    }
}
