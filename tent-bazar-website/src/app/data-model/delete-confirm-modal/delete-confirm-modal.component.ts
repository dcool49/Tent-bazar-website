import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-delete-confirm-modal',
  imports: [MatDialogModule,CommonModule,FormsModule,MatFormFieldModule],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.scss'
})
export class DeleteConfirmModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
