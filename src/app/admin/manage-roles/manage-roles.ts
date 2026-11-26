import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';

import { Auth } from '../../auth/auth';
import { Permission } from '../../roles/role.model';

@Component({
  selector: 'app-manage-roles',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule
  ],
  templateUrl: './manage-roles.html',
  styleUrl: './manage-roles.css'
})
export class ManageRoles {

  auth = inject(Auth);

  newRole = '';

  editingRoleName: string | null = null;
  editedName = '';
  editedPermissions: Permission[] = [];

  permissions: Permission[] = [
    'manage-users',
    'manage-roles',
    'create-request',
    'approve-request'
  ];

  displayedColumns = [
    'name',
    'manage-users',
    'manage-roles',
    'create-request',
    'approve-request',
    'actions'
  ];

  addRole(form: NgForm): void {

    if (this.auth.addRole(this.newRole)) {
      alert('Role added successfully!');
      this.newRole = '';
      form.resetForm();
    } else {
      alert('Unable to add role.');
    }

  }

  editRole(roleName: string): void {

    const role = this.auth.roles().find(
      r => r.name === roleName
    );

    if (!role || roleName === 'Admin') return;

    this.editingRoleName = roleName;
    this.editedName = role.name;
    this.editedPermissions = [...role.permissions];

  }

  changePermission(permission: Permission): void {

    if (this.editedPermissions.includes(permission)) {

      this.editedPermissions = this.editedPermissions.filter(
        p => p !== permission
      );

    } else {

      this.editedPermissions = [
        ...this.editedPermissions,
        permission
      ];

    }

  }

  saveRole(): void {

    if (!this.editingRoleName) return;

    const oldName = this.editingRoleName;
    const newName = this.editedName.trim();

    if (!newName) {
      alert('Role name cannot be empty.');
      return;
    }

    // The built-in User role cannot be renamed.
    if (oldName === 'User' && newName !== 'User') {
      alert('The User role cannot be renamed.');
      return;
    }

    let roleName = oldName;

    if (oldName !== newName) {

      const updated = this.auth.updateRole(oldName, newName);

      if (!updated) {
        alert('Unable to update role name.');
        return;
      }

      roleName = newName;
    }

    const role = this.auth.roles().find(
      r => r.name === roleName
    );

    if (!role) return;

    for (const permission of this.permissions) {

      const oldValue = role.permissions.includes(permission);
      const newValue = this.editedPermissions.includes(permission);

      if (oldValue !== newValue) {
        this.auth.togglePermission(roleName, permission);
      }

    }

    this.cancelEdit();

  }

  cancelEdit(): void {

    this.editingRoleName = null;
    this.editedName = '';
    this.editedPermissions = [];

  }

  deleteRole(roleName: string): void {

    if (!confirm(`Delete ${roleName} role?`)) return;

    if (!this.auth.deleteRole(roleName)) {
      alert('Cannot delete this role.');
    }

  }

}