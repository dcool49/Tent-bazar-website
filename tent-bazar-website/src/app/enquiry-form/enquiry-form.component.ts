import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-enquiry-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './enquiry-form.component.html',
  styleUrl: './enquiry-form.component.scss'
})
export class EnquiryFormComponent implements OnInit {
  currentStep = 1;
  myForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
    addressLine: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required]),
  });
  localStorageProductData = JSON.parse(localStorage.getItem("addedProduct") as any);
  constructor(private route: Router, private dataService: DataService) { }
  ngOnInit(): void {
  }
  goto(path: any) {
    this.route.navigate(['/', path]);
  }

  submit() {
    this.myForm.markAsDirty();
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      this.placeOrder();
    }

  }
  nextStep() {
  if (this.currentStep === 1) {
    if (this.myForm.get('name')?.valid && this.myForm.get('mobile')?.valid) {
      this.userVerification();
    } else {
      this.myForm.get('name')?.markAsTouched();
      this.myForm.get('mobile')?.markAsTouched();
    }
  } else if (this.currentStep === 2) {
    if (this.myForm.valid) {
      this.submit(); // final submission
    } else {
      Object.values(this.myForm.controls).forEach(control => control.markAsTouched());
    }
  }
}

userVerification(){
  const url = 'user/validateUser';
  const payload = {
    mobile:this.myForm.get('mobile')?.value,
    name:this.myForm.get('name')?.value
  }
  this.dataService.postAPICall(url,payload).subscribe((res:any)=>{
    this.currentStep = 2;
    this.dataService.userDetails = res.data;
    localStorage.setItem('userId',this.dataService.userDetails['_id']);
  },(err)=>{
    console.error(err);
  })
}

placeOrder(){
  const url = 'order/add'
  const productItem = this.localStorageProductData.map((res:any)=>{
     return {"productId" : res._id,
        "quantity" : res.quantity}
  })
  console.log("productItem",productItem);
  const payload ={
    productDetails: productItem,
    "buyerId": this.dataService.userDetails['_id'],
     "addressLine" : this.myForm.get('addressLine')?.value,
     "city" : this.myForm.get('city')?.value,
     "state" : this.myForm.get('state')?.value,
    "pinCode" : this.myForm.get('pinCode')?.value,
  }
  this.dataService.postAPICall(url,payload).subscribe((res:any)=>{
    this.goto('thankyou');
  },(err)=>{
    console.error(err);
  })
}

}
