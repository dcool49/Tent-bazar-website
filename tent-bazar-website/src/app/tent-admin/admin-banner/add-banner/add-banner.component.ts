import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../../data-model/data-model.component';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-banner',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-banner.component.html',
  styleUrl: './add-banner.component.scss'
})
export class AddBannerComponent implements OnInit {
    rank: number | undefined;
    myForm: FormGroup = new FormGroup({
      bannerName: new FormControl('', Validators.required),
      rank: new FormControl('', [Validators.required]),
    });
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,private dataService: DataService,
      private toastr: ToastrService) {}
    ngOnInit(): void {
      if(this.data.edit){
        this.myForm.patchValue(this.data?.value);
        this.previewUrl = this.data?.value.bannerImage[0].img_name;
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
      formData.append('_id', this.data.value._id);
      const url = 'banner/updateImage';
      this.dataService.putAPICall(url, formData).subscribe(
        (response) => {
          this.toastr.success('banner Image change successfully', 'Success',{ timeOut: 5000 });
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
      formData.append('bannerName', this.myForm.get('bannerName')?.value);
      formData.append('rank', this.myForm.get('rank')?.value);
    
      const url = 'banner/add';
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
      const url = 'banner/update'
      const payload = {
        bannerName:this.myForm.get('bannerName')?.value,
        rank : this.myForm.get('rank')?.value,
        _id : this.data?.value?._id
      }
  
      this.dataService.patchApiCall(url, payload).subscribe(
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
}
