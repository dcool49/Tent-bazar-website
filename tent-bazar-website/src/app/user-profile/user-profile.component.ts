import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styles: []
})
export class UserProfileComponent implements OnInit {
  isEditing = false;
  isSaving = false;
  saveSuccess = false;
  userData: any = {};

  profileForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
    companyName: new FormControl(''),
    addressLine: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    pinCode: new FormControl(''),
  });

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    const savedData = JSON.parse(localStorage.getItem('enquiryUserData') || 'null');
    if (!savedData?.userId) {
      this.router.navigate(['/enquiry']);
      return;
    }
    this.userData = savedData;
    this.profileForm.patchValue({
      _id: savedData.userId,
      name: savedData.name || '',
      mobile: savedData.mobile || '',
      companyName: savedData.companyName || '',
      addressLine: savedData.addressLine || '',
      city: savedData.city || '',
      state: savedData.state || '',
      pinCode: savedData.pinCode || '',
    });
  }

  get initial(): string {
    return (this.userData.name || 'U').charAt(0).toUpperCase();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.saveSuccess = false;
    if (!this.isEditing) {
      // reset form to saved data on cancel
      this.profileForm.patchValue({
        name: this.userData.name || '',
        mobile: this.userData.mobile || '',
        companyName: this.userData.companyName || '',
        addressLine: this.userData.addressLine || '',
        city: this.userData.city || '',
        state: this.userData.state || '',
        pinCode: this.userData.pinCode || '',
      });
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const payload = this.profileForm.value;
    this.dataService.patchApiCall('user/update', payload).subscribe({
      next: () => {
        const updated = {
          ...this.userData,
          name: payload.name,
          mobile: payload.mobile,
          companyName: payload.companyName,
          addressLine: payload.addressLine,
          city: payload.city,
          state: payload.state,
          pinCode: payload.pinCode,
        };
        localStorage.setItem('enquiryUserData', JSON.stringify(updated));
        this.userData = updated;
        this.isSaving = false;
        this.isEditing = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: () => { this.isSaving = false; }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
