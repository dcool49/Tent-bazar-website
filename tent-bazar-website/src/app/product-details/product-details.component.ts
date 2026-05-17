import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  productId: any;
  productDetals: any;
  quantity: number = 1;
  localStorageData: any[] = JSON.parse(localStorage.getItem("addedProduct") as any) ?? [];
  cartAdded = false;
  selectedImage: any;
  adminView = false;
  constructor(
    private route: Router,
    private dataService: DataService,
    @Optional() @Inject(MAT_DIALOG_DATA) dialogData: any,
  ) {
    this.adminView = !!dialogData?.adminView;
    this.productId = localStorage.getItem('productId');
    const index = this.localStorageData.findIndex((prod: any) => prod._id === this.productId)
    if (index != -1) {
      this.cartAdded = true;
    }
  }
  ngOnInit(): void {
    this.getProductDetails();
  }
  urlRout(path: any) {
    this.route.navigate(['/' + path])
  }
  getProductDetails() {
    const url = 'product/fetchbyid?_id=' + this.productId;
    this.dataService.getAPICall(url).subscribe((res: any) => {
      this.productDetals = res?.data?.[0];
      this.selectedImage = this.productDetals?.image?.[0].img_name;
    }, (err) => {
      console.error(err);
    })
  }
  addcart() {
    let localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    let addedProduct: any = [];
    const productDetals = { ...this.productDetals, quantity: this.quantity }
    if (localStorageData) {
      const index = localStorageData.findIndex((prod: any) => prod._id === this.productId)
      if (index !== -1) {
        return;
      }
      localStorageData.push(productDetals)
      localStorage.setItem("addedProduct", JSON.stringify(localStorageData));
    } else {
      addedProduct.push(productDetals)
      localStorage.setItem("addedProduct", JSON.stringify(addedProduct));
    }
    this.cartAdded = true;
  }

  removecart() {
    let localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    const index = localStorageData.findIndex((prod: any) => prod._id === this.productId);
    if (index !== -1) {
      localStorageData.splice(index, 1);
      localStorage.setItem("addedProduct", JSON.stringify(localStorageData));
      this.cartAdded = false;
    }
  }
}
