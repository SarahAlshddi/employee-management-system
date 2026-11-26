import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from './auth';
import { Permission } from '../roles/role.model';

// Authentication Guard
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login']);
};

// Admin Guard
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return auth.isAdmin()
    ? true
    : router.createUrlTree(['/no-access']);
};

// Permission Guard
export const permissionGuard = (
  permission: Permission
): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }

    return auth.hasPermission(permission)
      ? true
      : router.createUrlTree(['/no-access']);
  };
};

export const adminDashboardGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (auth.canAccessDashboard()) {
    return true;
  }

  return router.createUrlTree(['/no-access']);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return true;
  }

  if (auth.canAccessDashboard()) {
    return router.createUrlTree(['/admin']);
  }

  if (auth.hasPermission('create-request')) {
    return router.createUrlTree(['/requests']);
  }

  return router.createUrlTree(['/no-access']);
};