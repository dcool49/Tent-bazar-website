import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-enquiry-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './enquiry-form.component.html',
  styleUrl: './enquiry-form.component.scss'
})
export class EnquiryFormComponent implements OnInit {
  myForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
    addressLine: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required]),
  });
constructor(private route:Router,private dataService:DataService){}
  ngOnInit(): void {
  }
goto(path:any){
  this.route.navigate(['/',path]);
}

submit(){
  this.myForm.markAsDirty();
  this.myForm.markAllAsTouched();
  if(this.myForm.valid){
    this.dataService.showLoader()
    setTimeout(()=>{
      this.dataService.hideLoader()
     this.goto('thankyou');
  },3000)
  }

}
}
