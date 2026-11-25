import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
  ],
  templateUrl: './manage-roles.html',
  styleUrl: './manage-roles.css'
})
export class ManageRoles {

  auth = inject(Auth);

  newRole = '';

  permissions: Permission[] = [
    'manage-users',
    'manage-roles',
    'create-request',
    'approve-request'
  ];

  addRole(): void {
    if (this.auth.addRole(this.newRole)) {
      this.newRole = '';
    } else {
      alert('Unable to add role.');
    }
  }

  editRole(roleName: string): void {
    const newName = prompt('Enter new role name:', roleName);

    if (newName === null) return;

    if (!this.auth.updateRole(roleName, newName)) {
      alert('Unable to update role.');
    }
  }

  deleteRole(roleName: string): void {
    if (!confirm(`Delete ${roleName} role?`)) return;

    if (!this.auth.deleteRole(roleName)) {
      alert('Cannot delete a protected or assigned role.');
    }
  }

  togglePermission(roleName: string, permission: Permission): void {
    this.auth.togglePermission(roleName, permission);
  }
}