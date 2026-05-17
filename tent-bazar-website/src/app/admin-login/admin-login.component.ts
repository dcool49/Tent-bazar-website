import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  constructor(private dataServive:DataService, private route:Router, private authService:AuthService, private toastr:ToastrService){}
  login(){
    if(!this.phoneNumber || !this.password){
      this.toastr.warning('Phone number and password are required', 'Missing Fields');
      return;
    }
    const url = 'user/v2/login';
    const payload = {
      mobile:this.phoneNumber,
      password:this.password
    }
    this.dataServive.postAPICall(url,payload).subscribe({
      next: (res:any)=>{
        if(res.status){
          localStorage.setItem('role', res.data[0].role);
          localStorage.setItem('adminUser', JSON.stringify(res.data[0]));
          const token = res.token || res.data[0]?.token;
          if (token) {
            localStorage.setItem('token', token);
          }
          this.authService.login();
          this.toastr.success('Welcome back!', 'Login Successful');
          this.route.navigate(['/admin-home'])
        } else {
          this.toastr.error('Invalid credentials. Please try again.', 'Login Failed');
        }
      },
      error: (err)=>{
        const msg = err?.error?.message || 'Something went wrong. Please try again.';
        this.toastr.error(msg, 'Login Failed');
      }
    })
  }
}
