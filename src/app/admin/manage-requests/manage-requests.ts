import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Auth } from '../../auth/auth';
import { RequestService } from '../../requests/request';

@Component({
  selector: 'app-manage-requests',
  imports: [
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './manage-requests.html',
  styleUrl: './manage-requests.css'
})
export class ManageRequests {

  auth = inject(Auth);
  requestService = inject(RequestService);

  getUsername(userId: number): string {
    return this.auth.users().find(
      user => user.id === userId
    )?.username ?? 'Deleted user';
  }

  approve(id: number): void {
    this.requestService.updateStatus(id, 'Approved');
  }

  reject(id: number): void {
    this.requestService.updateStatus(id, 'Rejected');
  }
}