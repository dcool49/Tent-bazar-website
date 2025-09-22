import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  phoneNumber:any;
  password:any;
  constructor(private dataServive:DataService){}
  login(){
    if(!this.phoneNumber || !this.password){
      alert("password or mobile number is required");
      return;
    }
    const url = 'user/login';
    const payload = {
      mobileNumber:this.phoneNumber,
      password:this.password
    }
    this.dataServive.postAPICall(url,payload).subscribe((res)=>{
      console.log("success",res);
    },(err)=>{
      console.log(err)
    })
  }
}
