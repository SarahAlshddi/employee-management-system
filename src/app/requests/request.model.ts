export interface EmployeeRequest {
  id: number;
  userId: number;
  type: 'Leave' | 'Loan';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}