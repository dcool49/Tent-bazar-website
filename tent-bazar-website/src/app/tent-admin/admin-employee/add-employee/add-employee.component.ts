import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../../data-model/data-model.component';
import { DataService } from '../../../services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  standalone: false,
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent implements OnInit {
  myForm: FormGroup = new FormGroup({
    mobile: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    _id: new FormControl(''),
  });
  url = 'user/v2/register';
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private dataService: DataService) {}
  ngOnInit(): void {
    if(this.data.edit){
      this.myForm.patchValue(this.data.value);
      this.myForm.controls['password'].setValue(this.data.value['passwordToShow']);
      this.url = 'user/v2/update'
    }
  }


    onNoClick(): void {
      this.dialogRef.close();
    }
    saveClick(){
      if(this.data.edit){
        this.updateClick();
        return
      }
      let payload = this.myForm.value;
      this.dataService.postAPICall(this.url,payload).subscribe((res)=>{
        this.dialogRef.close('success');
      },err=>{
        console.error(err);
      })
    }

    updateClick(){
      let payload = this.myForm.value;
      this.dataService.patchApiCall(this.url,payload).subscribe((res)=>{
        this.dialogRef.close('success');
      },err=>{
        console.error(err);
      })
    }

    generateRandomPassword(length: number = 12, includeUppercase: boolean = true, includeNumbers: boolean = true, includeSymbols: boolean = true): string {
      let characters = 'abcdefghijklmnopqrstuvwxyz';
      if (includeUppercase) {
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      }
      if (includeNumbers) {
        characters += '0123456789';
      }
      if (includeSymbols) {
        characters += '!@#$%^&*()_+[]{}|;:,.<>?';
      }
  
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      this.myForm.controls['password'].setValue(password);
      return password;
    }


}
