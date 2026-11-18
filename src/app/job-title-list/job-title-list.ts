import { Component, inject, effect, viewChild } from '@angular/core';

import type { JobTitle } from './job-title.model';

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
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

import { JobTitleService } from '../services/job-title';
import { DepartmentService } from '../services/department';
import { JobTitleDialog } from '../job-title-dialog/job-title-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-job-title-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './job-title-list.html',
  styleUrl: './job-title-list.css'
})
export class JobTitleList {

  private jobTitleService = inject(JobTitleService);
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);

  jobTitlesList = this.jobTitleService.jobTitles;
  departmentsList = this.departmentService.departments;

  dataSource = new MatTableDataSource<JobTitle>([]);

  paginator = viewChild(MatPaginator);

  displayedColumns: string[] = [
    'id',
    'name',
    'department',
    'description',
    'actions'
  ];

  searchText = '';
  selectedDepartment: number | null = null;

  constructor() {

    effect(() => {
      this.dataSource.data = this.jobTitlesList();
    });

    effect(() => {
      const paginator = this.paginator();

      if (paginator) {
        this.dataSource.paginator = paginator;
      }
    });

    // Filter by search text and department
    this.dataSource.filterPredicate = (job, filter) => {

      const filterData: {
        searchText: string;
        departmentId: number | null;
      } = JSON.parse(filter);

      const departmentName = this.getDepartmentName(job.departmentId);

      const searchableText = (
        job.name + ' ' +
        job.description + ' ' +
        departmentName
      ).toLowerCase();

      const matchesSearch =
        searchableText.includes(filterData.searchText);

      const matchesDepartment =
        filterData.departmentId === null ||
        job.departmentId === filterData.departmentId;

      return matchesSearch && matchesDepartment;
    };

  }

  // Get department name from its ID
  getDepartmentName(departmentId: number): string {

    const department = this.departmentsList().find(
      dep => dep.id === departmentId
    );

    return department?.name ?? 'Unknown';
  }

  // Search
  applySearch(event: Event) {

    this.searchText =
      (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.applyFilters();
  }

  // Filter by Department
  filterByDepartment(departmentId: number | null) {

    this.selectedDepartment = departmentId;

    this.applyFilters();
  }

  // Apply both filters
  applyFilters() {

    this.dataSource.filter = JSON.stringify({
      searchText: this.searchText,
      departmentId: this.selectedDepartment
    });

    this.dataSource.paginator?.firstPage();
  }

  // Add Job Title
  openAddDialog() {

    const dialogRef = this.dialog.open(JobTitleDialog, {
      width: '450px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.jobTitleService.addJobTitle(result);
      }

    });
  }

  // Edit Job Title
  editJobTitle(job: JobTitle) {

    const dialogRef = this.dialog.open(JobTitleDialog, {
      width: '450px',
      data: job
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.jobTitleService.updateJobTitle({
          id: job.id,
          ...result
        });
      }

    });
  }

  // Delete Job Title
  deleteJobTitle(job: JobTitle) {

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
  title: 'Delete Job Title',
  name: job.name
}
    });

    dialogRef.afterClosed().subscribe(confirmed => {

      if (confirmed === true) {
        this.jobTitleService.deleteJobTitle(job.id);
      }

    });
  }

}