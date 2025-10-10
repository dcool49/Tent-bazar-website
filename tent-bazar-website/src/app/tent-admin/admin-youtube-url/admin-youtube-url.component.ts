import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { AddYoutubeComponent } from './add-youtube/add-youtube.component';
import { DeleteConfirmModalComponent } from '../../data-model/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-admin-youtube-url',
  standalone: false,
  templateUrl: './admin-youtube-url.component.html',
  styleUrl: './admin-youtube-url.component.scss',
})
export class AdminYoutubeUrlComponent implements OnInit {
  youtubeList: any;
  selectedID: any;
  constructor(
    private route: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getYoutubelist();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddYoutubeComponent, {
      width: '500px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.getYoutubelist();
      }
    });
  }

  getYoutubelist() {
    const url = 'urls/fetch?type=youtube';
    this.dataService.getAPICall(url).subscribe(
      (res:any) => {
        this.youtubeList = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }


  deleteYoutubelist(id:any) {
    const url = 'urls/delete?url='+id;
    this.dataService.deleteAPICall(url).subscribe(
      (res:any) => {
       this.getYoutubelist();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  openDeleteDialog(prod: any): void {
    this.selectedID = prod._id;
    const dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
      width: '500px',
      data: {
        heading: 'Delete Product',
        msg: 'Are you sure you want to delete',
        name: prod.productName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.deleteYoutubelist(this.selectedID);
      }
    });
  }

}
