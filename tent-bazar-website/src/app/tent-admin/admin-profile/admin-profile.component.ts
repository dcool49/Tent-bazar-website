import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.scss'
})
export class AdminProfileComponent implements OnInit {
  isEditing = false;
  isSaving = false;
  saveSuccess = false;
  adminData: any = {};

  profileForm: FormGroup = new FormGroup({
    _id:      new FormControl(''),
    name:     new FormControl('', Validators.required),
    mobile:   new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role:     new FormControl(''),
  });

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const stored = JSON.parse(localStorage.getItem('adminUser') || 'null');
    if (stored) {
      this.adminData = stored;
      this.profileForm.patchValue({
        _id:      stored._id || '',
        name:     stored.name || '',
        mobile:   stored.mobile || '',
        password: stored.passwordToShow || '',
        role:     stored.role || '',
      });
    }
  }

  get initial(): string {
    return (this.adminData.name || 'A').charAt(0).toUpperCase();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.saveSuccess = false;
    if (!this.isEditing) {
      this.profileForm.patchValue({
        name:     this.adminData.name || '',
        mobile:   this.adminData.mobile || '',
        password: this.adminData.passwordToShow || '',
        role:     this.adminData.role || '',
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
    this.dataService.patchApiCall('user/v2/update', payload).subscribe({
      next: () => {
        const updated = { ...this.adminData, ...payload, passwordToShow: payload.password };
        localStorage.setItem('adminUser', JSON.stringify(updated));
        this.adminData = updated;
        this.isSaving = false;
        this.isEditing = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: () => { this.isSaving = false; }
    });
  }

  generateRandomPassword(): void {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    this.profileForm.controls['password'].setValue(pass);
  }
}
