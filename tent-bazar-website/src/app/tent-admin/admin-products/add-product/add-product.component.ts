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
  submitted = false;

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
      this.existingImagesData = this.data.value.image;
      this.previewUrl = this.data.value.image.map((image:any)=> image.img_name);
    }
  }

  urlRout(path: any) {
    this.route.navigate(['/admin-home/' + path]);
  }
  previewUrl: any = [];
  selectedFile: File[] | null = [];
  existingImagesData: any[] = [];

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

removeImage(index: number) {
  const url = this.previewUrl[index];

  if (this.data?.edit && !url.startsWith('data:')) {
    const imgData = this.existingImagesData.find((img: any) => img.img_name === url);
    if (imgData) {
      const deleteUrl = `product/deleteimage?product_id=${this.data.value._id}&image_id=${imgData._id}`;
      this.dataService.deleteAPICall(deleteUrl).subscribe({
        next: () => {
          this.existingImagesData = this.existingImagesData.filter((img: any) => img._id !== imgData._id);
          this.previewUrl.splice(index, 1);
        },
        error: (error) => console.error('Error deleting image:', error),
      });
    }
  } else {
    const newFileIndex = this.previewUrl.slice(0, index).filter((u: string) => u.startsWith('data:')).length;
    this.selectedFile?.splice(newFileIndex, 1);
    this.previewUrl.splice(index, 1);
  }
}

  uploadFile(): void {
    this.submitted = true;
    if (!this.myForm.valid) {
      return;
    }

    const formData = new FormData();
    this.selectedFile?.forEach((file) => {
      formData.append('files', file, file?.name);
    });
    formData.append('productName', this.myForm.get('productName')?.value);
    formData.append('category_id', this.myForm.get('category_id')?.value);
    formData.append('price', this.myForm.get('price')?.value);
    formData.append('summery', this.myForm.get('summery')?.value);
    formData.append('product_selling_price', this.myForm.get('product_selling_price')?.value);
    formData.append('product_discount_price', this.myForm.get('product_discount_price')?.value);

    if (this.data.edit) {
      const existingImages = this.previewUrl
        .filter((url: string) => !url.startsWith('data:'))
        .map((url: string) => ({ img_name: url }));
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('_id', this.data.value._id);

      const newFiles = this.selectedFile ?? [];
      const updateProduct = () => {
        const url = 'product/update';
        this.dataService.putAPICall(url, formData).subscribe({
          next: () => this.dialogRef.close('response'),
          error: (error) => console.error('Error updating product:', error),
        });
      };

      if (newFiles.length > 0) {
        const imageFormData = new FormData();
        imageFormData.append('_id', this.data.value._id);
        newFiles.forEach((file) => {
          imageFormData.append('files', file, file.name);
        });
        this.dataService.putAPICall('product/updateimage', imageFormData).subscribe({
          next: () => updateProduct(),
          error: (error) => console.error('Error updating image:', error),
        });
      } else {
        updateProduct();
      }
    } else {
      const url = 'product/add';
      this.dataService.postAPICall(url, formData).subscribe(
        (response) => {
          this.dialogRef.close('response');
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
