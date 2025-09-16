import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class ReactiveFormComponent {
   profileForm = new FormGroup({
    name : new FormControl(),
    mobileNumber: new FormControl(),
    address: new FormControl(),
    address_city: new FormControl(),
    address_state: new FormControl(),
    address_pincode: new FormControl(),
  })
  onSubmit(){
    console.log(this.profileForm.value);    
  }
}
