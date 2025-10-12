import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../../data-model/data-model.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  myForm: FormGroup = new FormGroup({
    productName: new FormControl('', Validators.required),
    category_id: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    summery: new FormControl('', [Validators.required]),
    product_selling_price: new FormControl('', [Validators.required]),
    product_discount_price: new FormControl('', [Validators.required]),
  });
  category: any;

  constructor(
    private route: Router,
    private dataService: DataService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.category = this.data?.category
  }

  urlRout(path: any) {
    this.route.navigate(['/admin-home/' + path]);
  }
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name); // 'file' is the key expected by the backend

    this.dataService
      .postAPICall('YOUR_BACKEND_UPLOAD_API_ENDPOINT', formData)
      .subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
          // Handle success (e.g., show a success message, clear selected file)
        },
        (error) => {
          console.error('Error uploading file:', error);
          // Handle error
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
