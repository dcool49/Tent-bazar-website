import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  phoneNumber:any;
  password:any;
  passType = 'password';
  constructor(private dataServive:DataService, private route:Router,private authService:AuthService){}
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
    this.dataServive.postAPICall(url,payload).subscribe((res:any)=>{
      console.log("success",res);
      if(res.status){
        this.authService.login();
        this.route.navigate(['/admin-home'])
      }
    },(err)=>{
      console.log(err)
    })
  }
}
