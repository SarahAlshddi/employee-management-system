import { Component, inject, computed, signal } from '@angular/core';
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

import { DepartmentService } from '../services/department';
import { JobTitleService } from '../services/job-title';

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

  // Dependency Injection
  private dialogRef = inject(MatDialogRef<EmployeeDialog>);
  private departmentService = inject(DepartmentService);
  private jobTitleService = inject(JobTitleService);

  // Dialog Data
  data = inject<Employee | null>(MAT_DIALOG_DATA);

  // Data from Services
  departments = this.departmentService.departments;
  jobTitles = this.jobTitleService.jobTitles;

  // Form Data
  fName = this.data?.fName ?? '';
  lName = this.data?.lName ?? '';
  salary = this.data?.salary ?? 0;

  // Selected Department
  departmentId = signal<number | null>(
    this.data?.departmentId ?? null
  );

  // Selected Job Title
  jobTitleId: number | null =
    this.data?.jobTitleId ?? null;

  // Filter Job Titles
  filteredJobTitles = computed(() => {
    return this.jobTitles().filter(job =>
      job.departmentId === this.departmentId()
    );
  });

  // Department Change
  onDepartmentChange(departmentId: number) {
    this.departmentId.set(departmentId);
    this.jobTitleId = null;
  }

  // Save Employee
  save() {

    const departmentId = this.departmentId();

    if (
      !this.fName.trim() ||
      !this.lName.trim() ||
      this.salary <= 0 ||
      this.salary > 100000 ||
      departmentId === null ||
      this.jobTitleId === null
    ) {
      return;
    }

    const validDepartment = this.departments().some(
      dep => dep.id === departmentId
    );

    const validJobTitle = this.filteredJobTitles().some(
      job => job.id === this.jobTitleId
    );

    if (!validDepartment || !validJobTitle) {
      return;
    }

    const employeeData = {
      fName: this.fName.trim(),
      lName: this.lName.trim(),
      departmentId,
      jobTitleId: this.jobTitleId,
      salary: this.salary
    };

    this.dialogRef.close(employeeData);
  }

  // Cancel
  cancel() {
    this.dialogRef.close();
  }
}