import { Component, inject , effect , viewChild} from '@angular/core';
import type { Employee } from './employee.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../services/employee';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialog } from '../employee-dialog/employee-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-employee-list',
imports: [
  MatTableModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatIconModule
],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList {

private employeeService = inject(EmployeeService);
private dialog = inject(MatDialog);
employeesList = this.employeeService.employees;
  // TABLE DATA 
  dataSource = new MatTableDataSource<Employee>([]);
paginator = viewChild(MatPaginator);
  // Update table when employees change
constructor() {
  effect(() => {
    this.dataSource.data = this.employeesList();
  });

  effect(() => {
    const paginator = this.paginator();

    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  });
}
  


displayedColumns: string[] = [
  'id',
  'fName',
  'lName',
  'position',
  'salary',
  'actions'
];


openAddDialog() {

  const dialogRef = this.dialog.open(EmployeeDialog, {
    width: '450px',
    data: null
  });

  dialogRef.afterClosed().subscribe(result => {

    if (result) {
      this.employeeService.addEmployee(result);
    }

  });

}
  // Edit Employee
editEmployee(employee: Employee) {

  const dialogRef = this.dialog.open(EmployeeDialog, {
    width: '450px',
    data: employee
  });

  dialogRef.afterClosed().subscribe(result => {

    if (result) {
      this.employeeService.updateEmployee({
        id: employee.id,
        ...result
      });
    }

  });

}


  // Delete Employee
deleteEmployee(employee: Employee) {

  console.log('Delete clicked:', employee.id);

  const dialogRef = this.dialog.open(ConfirmDialog, {
    width: '400px',
    data: {
      name: `${employee.fName} ${employee.lName}`
    }
  });

  dialogRef.afterClosed().subscribe(confirmed => {
    if (confirmed === true) {
      this.employeeService.deleteEmployee(employee.id);
    }
  });
}


}