import { Component, inject, effect, viewChild } from '@angular/core';

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

import { DepartmentService } from '../services/department';
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

  private departmentService = inject(DepartmentService);

  private dialog = inject(MatDialog);

  departmentsList = this.departmentService.departments;

  dataSource = new MatTableDataSource<Department>([]);

  paginator = viewChild(MatPaginator);

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'actions'
  ];

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

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

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

  // Delete Department
  deleteDepartment(department: Department) {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        name: department.name
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed === true) {
        this.departmentService.deleteDepartment(department.id);
      }

    });
  }

}