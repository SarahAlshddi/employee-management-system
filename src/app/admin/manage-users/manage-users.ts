import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-manage-users',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css'
})
export class ManageUsers {

  auth = inject(Auth);

  newUsername = '';
  selectedRole = 'User';

  editingUserId: number | null = null;
  editingRole = '';

  addUser(form: NgForm): void {
    const added = this.auth.addUser(
      this.newUsername,
      this.selectedRole
    );

    if (added) {
      alert('User added successfully!');

      form.resetForm({
        username: '',
        role: 'User'
      });

      this.newUsername = '';
      this.selectedRole = 'User';
    } else {
      alert('Unable to add user.');
    }
  }

  editUser(id: number, role: string): void {
    this.editingUserId = id;
    this.editingRole = role;
  }

  saveUser(id: number): void {
    if (!this.editingRole) {
      alert('Please select a role.');
      return;
    }

    this.auth.updateUserRole(id, this.editingRole);

    this.editingUserId = null;
    this.editingRole = '';

    alert('User role updated successfully!');
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.editingRole = '';
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.auth.deleteUser(id);
    }
  }
}