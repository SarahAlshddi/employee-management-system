import {
  Component,
  inject,
  effect,
  viewChild,
  computed
} from '@angular/core';

import type { Department } from './department.model';

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

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DepartmentService } from '../services/department';
import { EmployeeService } from '../services/employee';
import { JobTitleService } from '../services/job-title';

import { DepartmentDialog } from '../department-dialog/department-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-department-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css'
})
export class DepartmentList {

  // Dependency Injection
  private departmentService = inject(DepartmentService);
  private employeeService = inject(EmployeeService);
  private jobTitleService = inject(JobTitleService);

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Data from Services
  departmentsList = this.departmentService.departments;
  employees = this.employeeService.employees;
  jobTitles = this.jobTitleService.jobTitles;

  // Table
  dataSource = new MatTableDataSource<Department>([]);

  paginator = viewChild(MatPaginator);

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'employeesCount',
    'actions'
  ];

  // Employees Count
  employeeCounts = computed(() => {

    const counts = new Map<number, number>();

    for (const employee of this.employees()) {

      const currentCount =
        counts.get(employee.departmentId) ?? 0;

      counts.set(
        employee.departmentId,
        currentCount + 1
      );
    }

    return counts;
  });

  constructor() {

    // Update table when departments change
    effect(() => {
      this.dataSource.data = this.departmentsList();
    });

    // Connect paginator
    effect(() => {

      const paginator = this.paginator();

      if (paginator) {
        this.dataSource.paginator = paginator;
      }

    });

    // Search by name or description
    this.dataSource.filterPredicate = (department, filter) => {

      const searchText = (
        department.name + ' ' + department.description
      ).toLowerCase();

      return searchText.includes(filter);
    };
  }

  // Search Departments
  applyFilter(event: Event) {

    const filterValue =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      filterValue.trim().toLowerCase();

    this.dataSource.paginator?.firstPage();
  }

  // Add Department
  openAddDialog() {

    const dialogRef = this.dialog.open(DepartmentDialog, {
      width: '450px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.departmentService.addDepartment(result);
      }

    });
  }

  // Edit Department
  editDepartment(department: Department) {

    const dialogRef = this.dialog.open(DepartmentDialog, {
      width: '450px',
      data: department
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.departmentService.updateDepartment({
          id: department.id,
          ...result
        });

      }

    });
  }

  // Check whether a department can be deleted
  canDeleteDepartment(department: Department): boolean {

    // Find Job Titles belonging to this department
    const relatedJobTitles = this.jobTitles().filter(
      job => job.departmentId === department.id
    );

    const relatedJobTitleIds = new Set(
      relatedJobTitles.map(job => job.id)
    );

    // Check employees assigned directly to the department
    const hasDepartmentEmployees = this.employees().some(
      employee => employee.departmentId === department.id
    );

    // Check employees using any of the department's Job Titles
    const hasJobTitleEmployees = this.employees().some(
      employee => relatedJobTitleIds.has(employee.jobTitleId)
    );

    return !hasDepartmentEmployees && !hasJobTitleEmployees;
  }

  // Delete Department with its Job Titles
  deleteDepartment(department: Department) {

    // Step 1: Check for related employees
    if (!this.canDeleteDepartment(department)) {

      this.snackBar.open(
        `Cannot delete ${department.name}. This department or its job titles have assigned employees.`,
        'Close',
        {
          duration: 5000
        }
      );

      return;
    }

    // Step 2: Find associated Job Titles
    const relatedJobTitles = this.jobTitles().filter(
      job => job.departmentId === department.id
    );

    const jobTitlesCount = relatedJobTitles.length;

    // Step 3: Prepare confirmation message
    const confirmationName = jobTitlesCount > 0
      ? `${department.name} and its ${jobTitlesCount} associated job title(s)`
      : department.name;

    // Step 4: Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '450px',
      data: {
        title: 'Delete Department',
        name: confirmationName
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed !== true) {
        return;
      }

      // Step 5: Recheck before deleting
      if (!this.canDeleteDepartment(department)) {

        this.snackBar.open(
          `Cannot delete ${department.name}. Related employees were found.`,
          'Close',
          {
            duration: 5000
          }
        );

        return;
      }

      // Step 6: Delete all Job Titles of this department
      const currentRelatedJobTitles = this.jobTitles().filter(
        job => job.departmentId === department.id
      );

      for (const job of currentRelatedJobTitles) {
        this.jobTitleService.deleteJobTitle(job.id);
      }

      // Step 7: Delete the Department
      this.departmentService.deleteDepartment(department.id);

      // Step 8: Show success message
      this.snackBar.open(
        `${department.name} and ${currentRelatedJobTitles.length} job title(s) deleted successfully.`,
        'Close',
        {
          duration: 3000
        }
      );

    });
  }

}