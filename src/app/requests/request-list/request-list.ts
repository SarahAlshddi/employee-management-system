import { Component, inject, computed } from '@angular/core';
import { FormsModule,NgForm} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Auth } from '../../auth/auth';
import { RequestService } from '../request';
import { ReasonDialog } from '../reason-dialog/reason-dialog';

@Component({
  selector: 'app-request-list',
  imports: [
    FormsModule,
    DatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './request-list.html',
  styleUrl: './request-list.css'
})
export class RequestList {

  auth = inject(Auth);
  requestService = inject(RequestService);
  dialog = inject(MatDialog);

  type: 'Leave' | 'Loan' = 'Leave';
  reason = '';

  displayedColumns = ['id', 'type', 'reason', 'status', 'date'];
  private snackBar = inject(MatSnackBar);
  myRequests = computed(() => {
    const userId = this.auth.currentUser()?.id;

    return this.requestService.requests().filter(
      request => request.userId === userId
    );
  });

submitRequest(form: NgForm): void {
  if (!this.reason.trim()) return;

  this.requestService.createRequest(this.type, this.reason);

  form.resetForm({
    type: 'Leave',
    reason: ''
  });

  this.snackBar.open(
    'Request submitted successfully!',
    'Close',
    { duration: 3000 }
  );
}

  viewReason(reason: string): void {
    this.dialog.open(ReasonDialog, {
      width: '400px',
      maxWidth: '90vw',
      data: reason
    });
  }
}