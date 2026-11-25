import { Injectable, inject, signal } from '@angular/core';

import { Auth } from '../auth/auth';
import { EmployeeRequest } from './request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private auth = inject(Auth);

  requests = signal<EmployeeRequest[]>(this.loadRequests());

  private loadRequests(): EmployeeRequest[] {
    try {
      const data = localStorage.getItem('requests');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(
      'requests',
      JSON.stringify(this.requests())
    );
  }

  createRequest(
    type: 'Leave' | 'Loan',
    reason: string
  ): void {

    const user = this.auth.currentUser();

    if (!user || !this.auth.hasPermission('create-request')) {
      return;
    }

    if (!reason.trim()) return;

    const request: EmployeeRequest = {
      id: Date.now(),
      userId: user.id,
      type,
      reason: reason.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    this.requests.update(requests => [
      ...requests,
      request
    ]);

    this.save();
  }

  updateStatus(
    id: number,
    status: 'Approved' | 'Rejected'
  ): void {

    if (!this.auth.hasPermission('approve-request')) {
      return;
    }

    this.requests.update(requests =>
      requests.map(request =>
        request.id === id && request.status === 'Pending'
          ? { ...request, status }
          : request
      )
    );

    this.save();
  }
}