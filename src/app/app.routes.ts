import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { RequestList } from './requests/request-list/request-list';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { NoAccess } from './auth/no-access/no-access';

import { EmployeeList } from './employee-list/employee-list';
import { DepartmentList } from './department-list/department-list';
import { JobTitleList } from './job-title-list/job-title-list';
import { ManageUsers } from './admin/manage-users/manage-users';
import { ManageRoles } from './admin/manage-roles/manage-roles';
import { ManageRequests } from './admin/manage-requests/manage-requests';

import {
  authGuard,
  adminGuard,
  permissionGuard,
  adminDashboardGuard,
  guestGuard
} from './auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
  path: 'login',
  component: Login,
  canActivate: [guestGuard]
  },
  {
    path: 'no-access',
    component: NoAccess,
    canActivate: [authGuard]
  },
  {
    path: 'requests',
    component: RequestList,
    canActivate: [
      authGuard,
      permissionGuard('create-request')
    ]
  },
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard, adminDashboardGuard]
  },
  {
    path: 'employees',
    component: EmployeeList,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'departments',
    component: DepartmentList,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'job-titles',
    component: JobTitleList,
    canActivate: [authGuard, adminGuard]
  },
  {
  path: 'admin/users',
  component: ManageUsers,
  canActivate: [
    authGuard,
    permissionGuard('manage-users')
  ]
},
{
  path: 'admin/roles',
  component: ManageRoles,
  canActivate: [
    authGuard,
    permissionGuard('manage-roles')
  ]
},
{
  path: 'admin/requests',
  component: ManageRequests,
  canActivate: [
    authGuard,
    permissionGuard('approve-request')
  ]
},
  {
    path: '**',
    redirectTo: 'login'
  }
];