import { Component, inject, effect, viewChild } from '@angular/core';

import type { Employee } from './employee.model';

import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeService } from '../services/employee';
import { DepartmentService } from '../services/department';
import { JobTitleService } from '../services/job-title';

import { EmployeeDialog } from '../employee-dialog/employee-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';


@Component({
  selector: 'app-employee-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList {

  // Dependency Injection
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private jobTitleService = inject(JobTitleService);
  private dialog = inject(MatDialog);


  // Data from Services
  employeesList = this.employeeService.employees;
  departments = this.departmentService.departments;
  jobTitles = this.jobTitleService.jobTitles;


  // Table Data
  dataSource = new MatTableDataSource<Employee>([]);

  paginator = viewChild(MatPaginator);


  // Table Columns
  displayedColumns: string[] = [
    'id',
    'fName',
    'lName',
    'department',
    'jobTitle',
    'salary',
    'actions'
  ];


  // Constructor
  constructor() {

    // Update table when employees change
    effect(() => {
      this.dataSource.data = this.employeesList();
    });

    // Connect Paginator
    effect(() => {
      const paginator = this.paginator();

      if (paginator) {
        this.dataSource.paginator = paginator;
      }
    });

  }


  // Get Department Name
  getDepartmentName(id: number): string {

    const department = this.departments().find(
      dep => dep.id === id
    );

    return department?.name ?? 'Unknown';
  }


  // Get Job Title Name
  getJobTitleName(id: number): string {

    const jobTitle = this.jobTitles().find(
      job => job.id === id
    );

    return jobTitle?.name ?? 'Unknown';
  }


  // Add Employee
  openAddDialog() {

    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '450px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.employeeService.addEmployee(result);
      }

    });

  }


  // Edit Employee
  editEmployee(employee: Employee) {

    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '450px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.employeeService.updateEmployee({
          id: employee.id,
          ...result
        });
      }

    });

  }


  // Delete Employee
  deleteEmployee(employee: Employee) {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
  title: 'Delete Employee',
  name: `${employee.fName} ${employee.lName}`
}
    });

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed === true) {
        this.employeeService.deleteEmployee(employee.id);
      }

    });

  }

}

