import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-add-order',
  standalone: false,
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss',
})
export class AddOrderComponent {
  // Customer search
  userSearch = '';
  userSearchResults: any[] = [];
  private userDebounce: any;
  searchingUsers = false;
  validatedUser: any = null;
  showDropdown = false;
  mobileError = '';

  // New customer fallback
  showNewCustomerForm = false;
  newCustomerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });
  validatingUser = false;
  userError = '';

  // Products
  productSearch = '';
  productSearchResults: any[] = [];
  private productDebounce: any;
  searchingProducts = false;
  selectedProducts: { productId: any; quantity: number }[] = [];

  // Address
  addressForm = new FormGroup({
    addressLine: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    pinCode: new FormControl('', Validators.required),
  });

  // Employee assignment
  canAssignEmployee = ['admin', 'manager'].includes(localStorage.getItem('role') || '');
  employeeList: any[] = [];
  selectedEmployeeId = '';

  // Submit
  submitting = false;
  submitError = '';

  constructor(private dataService: DataService, private router: Router) {
    if (this.canAssignEmployee) {
      this.dataService.getAPICall('user/v2/fetch?role=employee').subscribe({
        next: (res: any) => { this.employeeList = res.data || []; },
      });
    }
  }

  // ── Customer Search ─────────────────────────────────────────────────────────

  onUserSearch() {
    clearTimeout(this.userDebounce);
    this.validatedUser = null;
    this.showDropdown = false;
    this.mobileError = '';
    this.userSearchResults = [];

    // Strip non-digit characters
    const digitsOnly = this.userSearch.replace(/\D/g, '');
    if (this.userSearch !== digitsOnly) {
      this.userSearch = digitsOnly;
      this.mobileError = 'Only numbers are allowed';
      return;
    }

    if (!digitsOnly) return;

    if (digitsOnly.length < 10) {
      // Not enough digits yet — wait silently
      return;
    }

    if (digitsOnly.length > 10) {
      this.mobileError = 'Mobile number must be exactly 10 digits';
      return;
    }

    // Exactly 10 digits — call the API
    this.userDebounce = setTimeout(() => {
      this.searchingUsers = true;
      const url = 'user/fetch?role=user&mobile=' + encodeURIComponent(digitsOnly);
      this.dataService.getAPICall(url).subscribe({
        next: (res: any) => {
          this.userSearchResults = res.data || [];
          this.showDropdown = true;
          this.searchingUsers = false;
        },
        error: () => { this.searchingUsers = false; },
      });
    }, 300);
  }

  selectUser(user: any) {
    this.validatedUser = user;
    this.userSearch = user.name;
    this.userSearchResults = [];
    this.showDropdown = false;
    this.showNewCustomerForm = false;
    this.userError = '';
    // Auto-fill address from user profile
    this.addressForm.patchValue({
      addressLine: user.addressLine || '',
      city: user.city || '',
      state: user.state || '',
      pinCode: user.pinCode || '',
    });
  }

  clearUser() {
    this.validatedUser = null;
    this.userSearch = '';
    this.userSearchResults = [];
    this.showDropdown = false;
    this.userError = '';
    this.mobileError = '';
    this.addressForm.reset();
  }

  // ── New Customer Fallback ───────────────────────────────────────────────────

  toggleNewCustomerForm() {
    this.showNewCustomerForm = !this.showNewCustomerForm;
    if (this.showNewCustomerForm) {
      this.clearUser();
      this.newCustomerForm.reset();
    }
  }

  createCustomer() {
    this.newCustomerForm.markAllAsTouched();
    if (this.newCustomerForm.invalid) return;
    this.validatingUser = true;
    this.userError = '';
    const payload = {
      name: this.newCustomerForm.value.name?.trim(),
      mobile: this.newCustomerForm.value.mobile,
    };
    this.dataService.postAPICall('user/validateUser', payload).subscribe({
      next: (res: any) => {
        this.validatedUser = res.data;
        this.userSearch = res.data.name;
        this.showNewCustomerForm = false;
        this.validatingUser = false;
        // Auto-fill address if exists
        this.addressForm.patchValue({
          addressLine: res.data.addressLine || '',
          city: res.data.city || '',
          state: res.data.state || '',
          pinCode: res.data.pinCode || '',
        });
      },
      error: () => {
        this.userError = 'Could not find or create customer. Please check the details.';
        this.validatingUser = false;
      },
    });
  }

  // ── Products ────────────────────────────────────────────────────────────────

  onProductSearch() {
    clearTimeout(this.productDebounce);
    if (!this.productSearch.trim()) {
      this.productSearchResults = [];
      return;
    }
    this.productDebounce = setTimeout(() => {
      this.searchingProducts = true;
      const url = 'product/fetch?search=' + encodeURIComponent(this.productSearch.trim());
      this.dataService.getAPICall(url).subscribe({
        next: (res: any) => {
          this.productSearchResults = res.data || [];
          this.searchingProducts = false;
        },
        error: () => { this.searchingProducts = false; },
      });
    }, 350);
  }

  addProduct(prod: any) {
    const exists = this.selectedProducts.some(p => p.productId._id === prod._id);
    if (!exists) {
      this.selectedProducts.push({ productId: prod, quantity: 1 });
    }
    this.productSearch = '';
    this.productSearchResults = [];
  }

  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
  }

  increaseQty(item: any) { item.quantity++; }
  decreaseQty(item: any) { if (item.quantity > 1) item.quantity--; }

  get totalAmount(): number {
    return this.selectedProducts.reduce(
      (sum, p) => sum + (p.productId.price || 0) * p.quantity, 0
    );
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  get canSubmit(): boolean {
    return !!this.validatedUser && this.selectedProducts.length > 0 && this.addressForm.valid;
  }

  submitOrder() {
    this.addressForm.markAllAsTouched();
    if (!this.canSubmit) return;
    this.submitting = true;
    this.submitError = '';
    const payload: any = {
      buyerId: this.validatedUser._id,
      productDetails: this.selectedProducts.map(p => ({
        productId: p.productId._id,
        quantity: p.quantity,
      })),
      addressLine: this.addressForm.value.addressLine,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      pinCode: this.addressForm.value.pinCode,
    };
    if (this.selectedEmployeeId) payload['empId'] = this.selectedEmployeeId;
    this.dataService.postAPICall('order/add', payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/admin-home/Orders']);
      },
      error: () => {
        this.submitting = false;
        this.submitError = 'Failed to create order. Please try again.';
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin-home/Orders']);
  }
}
