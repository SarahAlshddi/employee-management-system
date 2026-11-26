import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Auth } from '../../auth/auth';
import { RequestService } from '../../requests/request';
import { ReasonDialog } from '../../requests/reason-dialog/reason-dialog';

@Component({
  selector: 'app-manage-requests',
  imports: [
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './manage-requests.html',
  styleUrl: './manage-requests.css'
})
export class ManageRequests {

  auth = inject(Auth);
  requestService = inject(RequestService);
  dialog = inject(MatDialog);

  displayedColumns = [
    'employee',
    'type',
    'reason',
    'date',
    'status',
    'actions'
  ];

  getUsername(userId: number): string {
    const user = this.auth.users().find(
      user => user.id === userId
    );

    if (user) {
      return user.username;
    }

    return 'Deleted user';
  }

  viewReason(reason: string): void {
    this.dialog.open(ReasonDialog, {
      width: '400px',
      maxWidth: '90vw',
      data: reason
    });
  }

  approve(id: number): void {
    this.requestService.updateStatus(id, 'Approved');
  }

  reject(id: number): void {
    this.requestService.updateStatus(id, 'Rejected');
  }
}