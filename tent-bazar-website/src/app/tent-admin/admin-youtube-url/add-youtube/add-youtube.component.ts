import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../../data-model/data-model.component';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-youtube',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-youtube.component.html',
  styleUrl: './add-youtube.component.scss'
})
export class AddYoutubeComponent {
  youtubeUrl:any = 'https://www.youtube.com/embed/';
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private dataService: DataService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  saveClick(){
    if(!this.youtubeUrl){
      alert('please enter URL');
      return;
    }
    const payload = {
      url:this.youtubeUrl,
      type:'youtube'
    }
    const apiUrl = 'urls/add'
    this.dataService.postAPICall(apiUrl,payload).subscribe((res)=>{
      this.dialogRef.close('success');
    },err=>{
      console.error(err);
    })
  }

  
}
