import { Injectable, signal, computed } from '@angular/core';

import { User } from '../users/user.model';
import { Role, Permission } from '../roles/role.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private initialUsers: User[] = [
    { id: 1, username: 'admin', role: 'Admin' },
    { id: 2, username: 'user', role: 'User' }
  ];

  private initialRoles: Role[] = [
    {
      name: 'Admin',
      permissions: [
        'manage-users',
        'manage-roles',
        'approve-request'
      ]
    },
    {
      name: 'User',
      permissions: ['create-request']
    }
  ];

  users = signal<User[]>(
  this.load('users', this.initialUsers) as User[]
  );

  roles = signal<Role[]>(
    this.load('roles', this.initialRoles) as Role[]
  );

  private sessionId = signal<number | null>(
    this.load('sessionId', null) as number | null
  );

  currentUser = computed(
    () => this.users().find(u => u.id === this.sessionId()) ?? null
  );

isLoggedIn = computed(() => this.currentUser() !== null);

isAdmin = computed(() =>
  this.currentUser()?.role === 'Admin'
);

canAccessDashboard = computed(() =>
  this.hasPermission('manage-users') ||
  this.hasPermission('manage-roles') ||
  this.hasPermission('approve-request')
);

  private load(key: string, fallback: unknown): unknown {
  try {
    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }

    return fallback;
  } catch {
    return fallback;
  }
}

  private save(key: string, data: unknown): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  login(username: string): boolean {
    const user = this.users().find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!user) return false;

    this.sessionId.set(user.id);
    this.save('sessionId', user.id);

    return true;
  }

  logout(): void {
    this.sessionId.set(null);
    localStorage.removeItem('sessionId');
  }

  hasPermission(permission: Permission): boolean {
    const user = this.currentUser();

    if (!user) return false;

    const role = this.roles().find(r => r.name === user.role);

    return role?.permissions.includes(permission) ?? false;
  }

  addUser(username: string, role: string): boolean {
    if (!this.hasPermission('manage-users')) return false;

    username = username.trim();

    if (!username || !this.roles().some(r => r.name === role)) {
      return false;
    }

    if (this.users().some(
      u => u.username.toLowerCase() === username.toLowerCase()
    )) {
      return false;
    }

    const user: User = {
      id: Date.now(),
      username,
      role
    };

    this.users.update(users => [...users, user]);
    this.save('users', this.users());

    return true;
  }

  updateUserRole(id: number, role: string): void {
    if (!this.hasPermission('manage-users')) return;
    if (!this.roles().some(r => r.name === role)) return;
    if (id === this.currentUser()?.id) return;

    this.users.update(users =>
      users.map(u => u.id === id ? { ...u, role } : u)
    );

    this.save('users', this.users());
  }

  deleteUser(id: number): void {
    if (!this.hasPermission('manage-users')) return;
    if (id === this.currentUser()?.id) return;

    this.users.update(users =>
      users.filter(u => u.id !== id)
    );

    this.save('users', this.users());
  }

  addRole(name: string): boolean {
    if (!this.hasPermission('manage-roles')) return false;

    name = name.trim();

    if (!name || this.roles().some(
      r => r.name.toLowerCase() === name.toLowerCase()
    )) {
      return false;
    }

    this.roles.update(roles => [
      ...roles,
      { name, permissions: [] }
    ]);

    this.save('roles', this.roles());

    return true;
  }

    updateRole(oldName: string, newName: string): boolean {

    if (!this.hasPermission('manage-roles')) {
      return false;
    }

    newName = newName.trim();

    if (!newName || oldName === 'Admin' || oldName === 'User') {
      return false;
    }

    if (this.roles().some(
      role => role.name.toLowerCase() === newName.toLowerCase()
    )) {
      return false;
    }

    this.roles.update(roles =>
      roles.map(role =>
        role.name === oldName
          ? { ...role, name: newName }
          : role
      )
    );

    this.users.update(users =>
      users.map(user =>
        user.role === oldName
          ? { ...user, role: newName }
          : user
      )
    );

    this.save('roles', this.roles());
    this.save('users', this.users());

    return true;
  }

  deleteRole(roleName: string): boolean {

  if (!this.hasPermission('manage-roles')) {
    return false;
  }

  if (roleName === 'Admin' || roleName === 'User') {
    return false;
  }

  const roleExists = this.roles().some(
    role => role.name === roleName
  );

  if (!roleExists) {
    return false;
  }

  const isAssigned = this.users().some(
    user => user.role === roleName
  );

  if (isAssigned) {
    return false;
  }

  this.roles.update(roles =>
    roles.filter(role => role.name !== roleName)
  );

  this.save('roles', this.roles());

  return true;
}

  togglePermission(roleName: string, permission: Permission): void {

    if (!this.hasPermission('manage-roles')) return;
    if (roleName === 'Admin') return;

    this.roles.update(roles =>
      roles.map(role => {

        if (role.name !== roleName) {
          return role;
        }

        let permissions = role.permissions;

        if (permissions.includes(permission)) {
          permissions = permissions.filter(p => p !== permission);
        } else {
          permissions = [...permissions, permission];
        }

        return { ...role, permissions };
      })
    );

    this.save('roles', this.roles());
  }
}