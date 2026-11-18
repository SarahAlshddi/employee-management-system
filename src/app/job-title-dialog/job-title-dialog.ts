import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import type { JobTitle } from '../job-title-list/job-title.model';
import { DepartmentService } from '../services/department';

@Component({
  selector: 'app-job-title-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './job-title-dialog.html',
  styleUrl: './job-title-dialog.css'
})
export class JobTitleDialog {

  private dialogRef = inject(MatDialogRef<JobTitleDialog>);
  private departmentService = inject(DepartmentService);

  data = inject<JobTitle | null>(MAT_DIALOG_DATA);

  departments = this.departmentService.departments;

  name = this.data?.name ?? '';

  description = this.data?.description ?? '';

  departmentId: number | null = this.data?.departmentId ?? null;

  save() {

    if (
      !this.name.trim() ||
      !this.description.trim() ||
      this.departmentId === null
    ) {
      return;
    }

    // Make sure the selected department still exists
    const departmentExists = this.departments().some(
      dep => dep.id === this.departmentId
    );

    if (!departmentExists) {
      return;
    }

    this.dialogRef.close({
      name: this.name.trim(),
      description: this.description.trim(),
      departmentId: this.departmentId
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}