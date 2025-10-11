import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-data-model',
  imports: [],
  templateUrl: './data-model.component.html',
  styleUrl: './data-model.component.scss'
})
export class DataModelComponent {
  animal: any;
  name: any;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  imports: [FormsModule,MatFormFieldModule,MatDialogModule]
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}