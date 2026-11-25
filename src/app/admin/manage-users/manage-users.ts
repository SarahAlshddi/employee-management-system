import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  addUser(): void {
    const added = this.auth.addUser(
      this.newUsername,
      this.selectedRole
    );

    if (added) {
      this.newUsername = '';
    } else {
      alert('Unable to add user. Username may already exist.');
    }
  }

  changeRole(userId: number, role: string): void {
    this.auth.updateUserRole(userId, role);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.auth.deleteUser(id);
    }
  }
}