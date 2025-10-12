import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmModalComponent } from '../../data-model/delete-confirm-modal/delete-confirm-modal.component';
import { AddCategoryComponent } from './add-category/add-category.component';

@Component({
  selector: 'app-admin-category',
  standalone:false,
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.scss'
})
export class AdminCategoryComponent implements OnInit {
  categoryList: any;
  selectedID: any;
  constructor(
    private route: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getcategoryList();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '500px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getcategoryList();
      }
    });
  }

  getcategoryList() {
    const url = 'category/fetch';
    this.dataService.getAPICall(url).subscribe(
      (res:any) => {
        this.categoryList = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }


  deletecategorylist(id:any) {
    const url = 'urls/delete?url='+id;
    this.dataService.deleteAPICall(url).subscribe(
      (res:any) => {
       this.getcategoryList();
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
        this.deletecategorylist(this.selectedID);
      }
    });
  }

}
