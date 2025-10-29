import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgFor, NgIf } from '@angular/common';
import { NotFoundComponent } from '../landing-sections/not-found/not-found.component';

@Component({
  selector: 'app-sub-category',
  imports: [NgFor,NgIf],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss'
})
export class SubCategoryComponent implements OnInit,OnDestroy {
  catId:any
  productList: any = [];
  catName:any;
  localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
constructor(private route: Router,private dataService:DataService) { 
this.catId = localStorage.getItem("catId"); 
this.catName = localStorage.getItem("catName");

}
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
    this.getProductList();
  }
  urlRout(path: any,productId: any) {
    localStorage.setItem('productId',productId)
    this.route.navigate(['/' + path])
  }
  getProductList(){
    const url = 'product/fetch?category_id='+this.catId;
    this.dataService.getAPICall(url).subscribe((res:any)=>{
      this.productList = res.data;
      this.configCartButton();
    },(err)=>{
      console.error(err);
    })
  }

  configCartButton(){
    let localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    if(!localStorageData){
      this.resetCartButton();
      return;
    }
    this.productList = this.productList.map((prod:any)=>{
      const index = localStorageData.findIndex((data:any)=>data._id === prod._id);
      if(index !== -1){
        prod.cartAdded = true;
      }else{
         prod.cartAdded = false;
      }
      return prod
    });
  }

  addcart(product:any){
    let localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    let addedProduct:any = [];
    const productDetals = {...product,quantity:1,cartAdded:true}
    if(localStorageData){
      const index = localStorageData.findIndex((prod:any)=>prod._id===this.productList._id)
      if(index !== -1){
        return;
      }
      localStorageData.push(productDetals)
      localStorage.setItem("addedProduct",JSON.stringify(localStorageData));
    }else{
      addedProduct.push(productDetals)
      localStorage.setItem("addedProduct",JSON.stringify(addedProduct));
    }
    this.configCartButton();
  }

  removecart(product:any){
    let localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    const index = localStorageData.findIndex((prod:any)=>prod._id===product._id);
    if(index !== -1){
      localStorageData.splice(index, 1); 
      localStorage.setItem("addedProduct",JSON.stringify(localStorageData));
    }
    this.configCartButton();
  }

  resetCartButton(){
    this.productList = this.productList.map((prod:any)=>{
      return prod = {cartAdded:false,...prod};
    })
  }

}
