import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Auth } from '../../auth/auth';
import { RequestService } from '../request';

@Component({
  selector: 'app-request-list',
  imports: [FormsModule,DatePipe],
  templateUrl: './request-list.html',
  styleUrl: './request-list.css'
})
export class RequestList {

  auth = inject(Auth);
  requestService = inject(RequestService);

  type: 'Leave' | 'Loan' = 'Leave';
  reason = '';

  myRequests = computed(() => {
    const userId = this.auth.currentUser()?.id;

    return this.requestService.requests().filter(
      request => request.userId === userId
    );
  });

  submitRequest(): void {
    if (!this.reason.trim()) return;

    this.requestService.createRequest(this.type, this.reason);

    this.reason = '';
  }
}