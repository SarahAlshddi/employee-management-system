import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private auth = inject(Auth);
  private router = inject(Router);

  username = '';
  errorMessage = '';

login(): void {
  const success = this.auth.login(this.username);

  if (!success) {
    this.errorMessage = 'Invalid username';
    return;
  }

  this.errorMessage = '';

  if (this.auth.canAccessDashboard()) {
    this.router.navigate(['/admin']);
  } else if (this.auth.hasPermission('create-request')) {
    this.router.navigate(['/requests']);
  } else {
    this.router.navigate(['/no-access']);
  }
}

}