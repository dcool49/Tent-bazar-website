import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-product-details',
  imports: [NgIf],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  productId: any;
  productDetals: any;
  quantity: number = 1;
  localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
  cartAdded = false;
  constructor(private route: Router, private dataService: DataService) {
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
      this.productDetals = res?.data?.[0]
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
