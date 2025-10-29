import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgFor, NgIf } from '@angular/common';
import { NotFoundComponent } from '../landing-sections/not-found/not-found.component';

@Component({
  selector: 'app-product-list-search',
  imports: [NgIf, NgFor],
  templateUrl: '../sub-category/sub-category.component.html',
  styleUrl: '../sub-category/sub-category.component.scss',
})
export class ProductListSearchComponent implements OnInit,OnDestroy {
  productList: any = [];
  catName: any;
  localStorageData = JSON.parse(localStorage.getItem('addedProduct') as any);
  searchName = localStorage.getItem('searchName');
  constructor(
    private route: Router,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) {
    this.searchName = localStorage.getItem('searchName');
    this.catName = 'Search: ' + this.searchName;
  }
  ngOnDestroy(): void {
    localStorage.setItem('searchName','');
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.searchName = params.get('search');
      this.catName = 'Search: ' + this.searchName;
      if (this.searchName) {
        this.getProductList();
      } else {
        this.productList = null;
      }
    });
  }
  urlRout(path: any, productId: any) {
    localStorage.setItem('productId', productId);
    this.route.navigate(['/' + path]);
  }
  getProductList() {
    const url = 'product/fetch?search=' + this.searchName;
    this.dataService.getAPICall(url).subscribe(
      (res: any) => {
        this.productList = res.data;
        if (this.productList) {
          this.configCartButton();
        }
      },
      (err) => {
        console.error(err);
        this.productList = [];
      }
    );
  }

  configCartButton() {
    let localStorageData = JSON.parse(
      localStorage.getItem('addedProduct') as any
    );
    if (!localStorageData) {
      this.resetCartButton();
      return;
    }
    this.productList = this.productList.map((prod: any) => {
      const index = localStorageData.findIndex(
        (data: any) => data._id === prod._id
      );
      if (index !== -1) {
        prod.cartAdded = true;
      } else {
        prod.cartAdded = false;
      }
      return prod;
    });
  }

  addcart(product: any) {
    let localStorageData = JSON.parse(
      localStorage.getItem('addedProduct') as any
    );
    let addedProduct: any = [];
    const productDetals = { ...product, quantity: 1, cartAdded: true };
    if (localStorageData) {
      const index = localStorageData.findIndex(
        (prod: any) => prod._id === this.productList._id
      );
      if (index !== -1) {
        return;
      }
      localStorageData.push(productDetals);
      localStorage.setItem('addedProduct', JSON.stringify(localStorageData));
    } else {
      addedProduct.push(productDetals);
      localStorage.setItem('addedProduct', JSON.stringify(addedProduct));
    }
    this.configCartButton();
  }

  removecart(product: any) {
    let localStorageData = JSON.parse(
      localStorage.getItem('addedProduct') as any
    );
    const index = localStorageData.findIndex(
      (prod: any) => prod._id === product._id
    );
    if (index !== -1) {
      localStorageData.splice(index, 1);
      localStorage.setItem('addedProduct', JSON.stringify(localStorageData));
    }
    this.configCartButton();
  }

  resetCartButton() {
    this.productList = this.productList.map((prod: any) => {
      return (prod = { cartAdded: false, ...prod });
    });
  }
}
