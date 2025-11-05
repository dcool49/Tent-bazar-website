import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmModalComponent } from '../../data-model/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-admin-employee',
  standalone:false,
  templateUrl: './admin-employee.component.html',
  styleUrl: './admin-employee.component.scss'
})
export class AdminEmployeeComponent implements OnInit {
  List: any;
  role='employee'
  addComponent = AddEmployeeComponent;
  selectedID: any;
  getListUrl = 'user/v2/fetch?passwordToShow=true'
  constructor(private dataService:DataService,public dialog: MatDialog){}
  ngOnInit(): void {
    this.getList();
  }

  getList(){
    const url = this.getListUrl;
    this.dataService.getAPICall(url).subscribe(
      (res:any) => {
        this.List = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

    openDialog(edit:boolean,data:any): void {
      const dialogRef = this.dialog.open(this.addComponent, {
        width: '500px',
        data: {edit:edit,value:data},
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getList();
        }
      });
    }

      delete(id:any) {
        const url = 'user/v2/delete?_id='+id;
        this.dataService.deleteAPICall(url).subscribe(
          (res:any) => {
           this.getList();
          },
          (err) => {
            console.error(err);
          }
        );
      }
    
      openDeleteDialog(user: any): void {
        this.selectedID = user._id;
        const dialogRef = this.dialog.open(DeleteConfirmModalComponent, {
          width: '500px',
          data: {
            heading: 'Delete '+this.role,
            msg: 'Are you sure you want to delete',
            name: user.name,
          },
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.delete(this.selectedID);
          }
        });
      }

}
