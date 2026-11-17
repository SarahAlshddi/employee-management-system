import { Routes } from '@angular/router';

import { EmployeeList } from './employee-list/employee-list';
import { DepartmentList } from './department-list/department-list';
import { JobTitleList } from './job-title-list/job-title-list';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },
  {
    path: 'employees',
    component: EmployeeList
  },
  {
    path: 'departments',
    component: DepartmentList
  },
  {
    path: 'job-titles',
    component: JobTitleList
  }
];