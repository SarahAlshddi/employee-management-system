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

import type { Employee } from '../employee-list/employee.model';

@Component({
  selector: 'app-employee-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './employee-dialog.html',
  styleUrl: './employee-dialog.css'
})
export class EmployeeDialog {
private dialogRef = inject(MatDialogRef<EmployeeDialog>);

data = inject<Employee | null>(MAT_DIALOG_DATA);

fName = this.data?.fName ?? '';

lName = this.data?.lName ?? '';

position: Employee['position'] =
  this.data?.position ?? 'Frontend Developer';

salary = this.data?.salary ?? 0;
save() {
  if (
    !this.fName.trim() ||
    !this.lName.trim() ||
    this.salary <= 0 ||
    this.salary > 100000
  ) {
    return;
  }

  const employeeData = {
    fName: this.fName.trim(),
    lName: this.lName.trim(),
    position: this.position,
    salary: this.salary
  };

  this.dialogRef.close(employeeData);
}

cancel() {
  this.dialogRef.close();
}

}