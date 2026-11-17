import { Component, inject , effect , viewChild} from '@angular/core';
import { FormsModule } from '@angular/forms'; // for ngModel 
import type { Employee } from './employee.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../services/employee';

@Component({
  selector: 'app-employee-list',
imports: [
  FormsModule,
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule
],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList {

private employeeService = inject(EmployeeService);

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





  // Form Data
  fName = '';
  lName = '';

  position: Employee['position'] = 'Frontend Developer';

  salary = 0;


  // Editing
  editingId: number | null = null; // null = add , number = edit


  // Save Employee
  saveEmployee() {

    if (
      !this.fName.trim() || // عشان الفالديشن 
      !this.lName.trim() ||
      this.salary <= 0
    ) {
      return;
    }

    const employeeData = {
      fName: this.fName.trim(),
      lName: this.lName.trim(),
      position: this.position,
      salary: this.salary
    };

    if (this.editingId !== null) {

  this.employeeService.updateEmployee({
    id: this.editingId,
    ...employeeData
  });

} else {

  this.employeeService.addEmployee(employeeData);

}
    this.resetForm();
  }


  // Edit Employee
  editEmployee(employee: Employee) {

    this.editingId = employee.id;

    this.fName = employee.fName;
    this.lName = employee.lName;
    this.position = employee.position;
    this.salary = employee.salary;

  }


  // Delete Employee
  deleteEmployee(id: number) {

  this.employeeService.deleteEmployee(id);

    if (this.editingId === id) {
      this.resetForm();
    }

  }


  // Reset Form
  resetForm() {

    this.fName = '';
    this.lName = '';
    this.position = 'Frontend Developer';
    this.salary = 0;
    this.editingId = null; // عشان يرجع لوضع الاضافة 

  }

}