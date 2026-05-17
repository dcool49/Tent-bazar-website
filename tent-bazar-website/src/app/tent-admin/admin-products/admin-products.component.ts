import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmModalComponent } from '../../data-model/delete-confirm-modal/delete-confirm-modal.component';
import { ProductDetailsComponent } from '../../product-details/product-details.component';
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  productList: any;
  searchName = '';
  category: any;
  selectedID: any;
  p: number = 1;
  itemsPerPage: number = 10;
  value: any = '';

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
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => {
        this.productList = res.data.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => {
        console.error(err);
        this.productList = [];
      },
    });
  }

  getCatList() {
    const url = 'category/fetch';
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => { this.category = res.data; },
      error: (err) => { console.error(err); },
    });
  }

  getcatName(id: any): String {
    if (this.category.length > 1) {
      const index = this.category.findIndex((val: any) => id === val._id);
      return index !== -1 ? this.category[index]?.categoryName : '-';
    }
    return '-';
  }

  deleteProduct(id: any) {
    const url = 'product/delete?_id=' + id;
    this.dataService.deleteAPICall(url).subscribe({
      next: () => { this.getProductList(); },
      error: (err) => { console.error(err); },
    });
  }

  openDialog(prod: any): void {
    this.selectedID = prod._id;
    const dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
      width: '420px',
      data: {
        heading: 'Delete Product',
        msg: 'Are you sure you want to delete',
        name: prod.productName,
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) this.deleteProduct(this.selectedID);
      },
    });
  }

  openViewDialog(prod: any): void {
    localStorage.setItem('productId', prod._id);
    this.dialog.open(ProductDetailsComponent, {
      width: '90vw',
      maxWidth: '900px',
    });
  }

  urlRout(path: any) {
    this.route.navigate(['/admin-home/' + path]);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '640px',
      data: { category: this.category, edit: false },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) this.getProductList();
      },
    });
  }

  filterByCat() {
    if (!this.value) {
      this.getProductList();
      return;
    }
    const url = 'product/fetch?category_id=' + this.value;
    this.dataService.getAPICall(url).subscribe({
      next: (res: any) => {
        this.productList = res.data.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => {
        console.error(err);
        this.productList = [];
      },
    });
  }

  openEditDialog(prod: any) {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '640px',
      data: { category: this.category, edit: true, value: prod },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) this.getProductList();
      },
    });
  }
}
