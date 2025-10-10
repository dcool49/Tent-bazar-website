import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { AddInstagramComponent } from './add-instagram/add-instagram.component';
import { DeleteConfirmModalComponent } from '../../data-model/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-admin-instagram-url',
  standalone:false,
  templateUrl: './admin-instagram-url.component.html',
  styleUrl: './admin-instagram-url.component.scss'
})
export class AdminInstagramUrlComponent implements OnInit {
  InstagramList: any;
  selectedID: any;
  constructor(
    private route: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getInstagramList();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddInstagramComponent, {
      width: '500px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.getInstagramList();
      }
    });
  }

  getInstagramList() {
    const url = 'urls/fetch?type=instagram';
    this.dataService.getAPICall(url).subscribe(
      (res:any) => {
        this.InstagramList = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }


  deleteinstagramlist(id:any) {
    const url = 'urls/delete?url='+id;
    this.dataService.deleteAPICall(url).subscribe(
      (res:any) => {
       this.getInstagramList();
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
        this.deleteinstagramlist(this.selectedID);
      }
    });
  }

}
