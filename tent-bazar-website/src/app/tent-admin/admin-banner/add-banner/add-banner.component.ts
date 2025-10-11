import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../../data-model/data-model.component';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-banner',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-banner.component.html',
  styleUrl: './add-banner.component.scss'
})
export class AddBannerComponent {
  BannerUrl:any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private dataService: DataService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  saveClick(){
    if(!this.BannerUrl){
      alert('please enter URL');
      return;
    }
    const payload = {
      url:this.BannerUrl,
      type:'Banner'
    }
    const apiUrl = 'banner/add'
    this.dataService.postAPICall(apiUrl,payload).subscribe((res)=>{
      this.dialogRef.close('success');
    },err=>{
      console.error(err);
    })
  }

}
