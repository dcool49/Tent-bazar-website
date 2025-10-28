import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../../data-model/data-model.component';
import { DataService } from '../../../services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category',
  standalone: false,
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
  rank: number | undefined;
  myForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', Validators.required),
    rank: new FormControl('', [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private dataService: DataService,
    private toastr: ToastrService) {}
  ngOnInit(): void {
    if(this.data.edit){
      this.myForm.patchValue(this.data?.catData);
      this.previewUrl = this.data?.catData.image[0].img_name;
    }
  }
    previewUrl: any;
    selectedFile: File | null = null;
  
    onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
      if(this.data.edit){
       this.uploadEditFile();
      }
    }
  }
  uploadEditFile() {
    if (!this.selectedFile) {
      return;
    }
    const formData = new FormData();
    if (this.selectedFile?.name) {
      formData.append('files', this.selectedFile, this.selectedFile?.name); // 'file' is the key expected by the backend
    }
    formData.append('_id', this.data.catData._id);
    const url = 'category/updateImage';
    this.dataService.putAPICall(url, formData).subscribe(
      (response) => {
        this.toastr.success('Category Image change successfully', 'Success',{ timeOut: 5000 });
        this.dialogRef.close('response');
      },
      (error) => {
        console.error('Error uploading file:', error);
        // Handle error
      }
    );
  }
  
  // Remove selected image
  removeImage() {
    this.selectedFile = null;
    this.previewUrl = null;
    // Optionally reset the form control
   // this.myForm.get('image')?.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadFile(): void {
    if(this.data.edit){
      this.edit();
      return;
    }
    if (!this.selectedFile) {
      return;
    }
    if (!this.myForm.valid) {
      return;
    }
 

    const formData = new FormData();
    if (this.selectedFile?.name) {
      formData.append('files', this.selectedFile, this.selectedFile?.name); // 'file' is the key expected by the backend
    }
    formData.append('categoryName', this.myForm.get('categoryName')?.value);
    formData.append('rank', this.myForm.get('rank')?.value);
  
    const url = 'category/add';
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
  edit() {
    const url = 'category/update'
    const payload = {
      categoryName:this.myForm.get('categoryName')?.value,
      rank : this.myForm.get('rank')?.value,
      _id : this.data?.catData?._id
    }

    this.dataService.putAPICall(url, payload).subscribe(
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
  showSuccess() {
    this.toastr.success('Operation successful!', 'Success');
  }

  showError() {
    this.toastr.error('Something went wrong!', 'Error', { timeOut: 5000 });
  }

}
