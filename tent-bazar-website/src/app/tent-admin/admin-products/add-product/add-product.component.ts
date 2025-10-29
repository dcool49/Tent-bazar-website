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
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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
    this.category = this.data?.category;
    if(this.data.edit){
      this.myForm.patchValue(this.data.value);
      this.previewUrl = this.data.value.image.map((image:any)=> image.img_name)
    }
  }

  urlRout(path: any) {
    this.route.navigate(['/admin-home/' + path]);
  }
  previewUrl: any = [];
  selectedFile: File[] | null = [];

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile?.push(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.push(reader.result);
    };
    reader.readAsDataURL(file);
  }
}

// Remove selected image
removeImage(index:number) {
  this.selectedFile?.splice(index,1);
  this.previewUrl?.splice(index,1);
  // Optionally reset the form control
  this.myForm.get('image')?.reset();
}

  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }
    if (!this.myForm.valid) {
      return;
    }
    if(this.data.edit){
      return;
    }

    const formData = new FormData();
    this.selectedFile.forEach((file)=>{
      formData.append('files', file, file?.name);
    })
    // if (this.selectedFile?.name) {
    //   formData.append('files', this.selectedFile, this.selectedFile?.name); // 'file' is the key expected by the backend
    // }
    formData.append('productName', this.myForm.get('productName')?.value);
    formData.append('category_id', this.myForm.get('category_id')?.value);
    formData.append('price', this.myForm.get('price')?.value);
    formData.append('summery', this.myForm.get('summery')?.value);
    formData.append(
      'product_selling_price',
      this.myForm.get('product_selling_price')?.value
    );
    formData.append(
      'product_discount_price',
      this.myForm.get('product_discount_price')?.value
    );
    const url = 'product/add';
    this.dataService.postAPICall(url, formData).subscribe(
      (response) => {
        console.log('File uploaded successfully:', response);
        // Handle success (e.g., show a success message, clear selected file)
        this.dialogRef.close('response');
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
