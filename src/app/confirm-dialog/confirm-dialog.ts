import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface ConfirmDialogData {
  title: string;
  name: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialog {

  private dialogRef = inject(MatDialogRef<ConfirmDialog>);

  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}