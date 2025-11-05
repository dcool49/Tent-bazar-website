import { Component, OnInit } from '@angular/core';
import { DeleteConfirmModalComponent } from '../../data-model/delete-confirm-modal/delete-confirm-modal.component';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { AddBannerComponent } from './add-banner/add-banner.component';

@Component({
  selector: 'app-admin-banner',
  standalone:false,
  templateUrl: './admin-banner.component.html',
  styleUrl: './admin-banner.component.scss'
})
export class AdminBannerComponent implements OnInit {
  BannerList: any;
  selectedID: any;
  constructor(
    private route: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getBannerList();
  }

  openDialog(edit:boolean,data:any): void {
    const dialogRef = this.dialog.open(AddBannerComponent, {
      width: '500px',
      data: {edit:edit,value:data},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getBannerList();
      }
    });
  }

  getBannerList() {
    const url = 'banner/fetch';
    this.dataService.getAPICall(url).subscribe(
      (res:any) => {
        this.BannerList = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }


  deleteBannerlist(id:any) {
    const url = 'banner/delete?_id='+id;
    this.dataService.deleteAPICall(url).subscribe(
      (res:any) => {
       this.getBannerList();
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
      if (result) {
        this.deleteBannerlist(this.selectedID);
      }
    });
  }

}
