import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // for ngModel 
import type { Employee } from './employee.model';

@Component({
  selector: 'app-employee-list',
  imports: [FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList {

  // INPUT
  employeesList = input.required<Employee[]>();

  // OUTPUTS
  addEmployeeEvent = output<Omit<Employee, 'id'>>();// id is created randomly by the parent

  deleteEmployeeEvent = output<number>();

  updateEmployeeEvent = output<Employee>();


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

      this.updateEmployeeEvent.emit({
        id: this.editingId,
        ...employeeData
      });

    } else {

      this.addEmployeeEvent.emit(employeeData);

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

    this.deleteEmployeeEvent.emit(id);

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