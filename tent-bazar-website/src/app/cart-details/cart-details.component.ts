import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-details',
  imports: [NgFor],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss'
})
export class CartDetailsComponent implements OnInit {
  sumAmount=0;
  ngOnInit(): void {
    this.calculateSumAmount();
  }
  localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
  remove(id:any){
    const index = this.localStorageData.findIndex((prod:any)=>prod._id===id);
    if(index !== -1){
      this.localStorageData.splice(index, 1); 
      localStorage.setItem("addedProduct",JSON.stringify(this.localStorageData));
    }
    this.calculateSumAmount();
  }
  calculateSumAmount(){
    this.sumAmount = 0;
    const localStorageData = JSON.parse(localStorage.getItem("addedProduct") as any);
    localStorageData.forEach((element:any) => {
      this.sumAmount = this.sumAmount + (Number(element.price) * Number(element.quantity) );
    });
  }

  insertQuantity(){
    localStorage.setItem("addedProduct",JSON.stringify(this.localStorageData));
    this.calculateSumAmount()
  }

}
