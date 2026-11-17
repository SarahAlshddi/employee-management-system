import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import type { Department } from '../department-list/department.model';

@Component({
  selector: 'app-department-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './department-dialog.html',
  styleUrl: './department-dialog.css'
})
export class DepartmentDialog {

  private dialogRef = inject(MatDialogRef<DepartmentDialog>);

  data = inject<Department | null>(MAT_DIALOG_DATA);

  name = this.data?.name ?? '';

  save() {
    if (!this.name.trim()) {
      return;
    }

    this.dialogRef.close(this.name.trim());
  }

  cancel() {
    this.dialogRef.close();
  }
}