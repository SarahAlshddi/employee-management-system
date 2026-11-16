import { Component, signal } from '@angular/core';
import { EmployeeList } from './employee-list/employee-list';
import type { Employee } from './employee-list/employee.model';
@Component({
  selector: 'app-root',
  imports: [EmployeeList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  employees = signal<Employee[]>([
    {
      id: 2911 ,
      fName: 'Sara',
      lName: 'Ahmed',
      position: 'Frontend Developer',
      salary: 8000
    },
    {
      id: 6767 ,
      fName: 'Noura',
      lName: 'Ali',
      position: 'Backend Developer',
      salary: 9500
    },
    {
      id: 9264 ,
      fName: 'Reem',
      lName: 'Khalid',
      position: 'UI/UX Designer',
      salary: 7500
    },
    {
      id: 4639 ,
      fName: 'Mohammed',
      lName: 'Fahad',
      position: 'Project Manager',
      salary: 12000
    }
  ]);

  // Add Employee
addEmployee(employee: Omit<Employee, 'id'>) {

  let newId: number;

  do {
    newId = Math.floor(Math.random() * 9000) + 1000;
  } while (this.employees().some(emp => emp.id === newId)); //عشان مايصير فيه تكرار

  const newEmployee: Employee = {
    ...employee, // هو Spread Syntax، ويضيف خصائص الـ Object داخل الـ Object الجديد
    id: newId
  };
 
  this.employees.update(current => [ // هنا نحدث الاراي الاساسي بعد
    ...current,
    newEmployee
  ]);
}
  // Delete Employee
  deleteEmployee(id: number) {

    this.employees.update(current =>
      current.filter(emp => emp.id !== id)
    );
  }

  // Update Employee
  updateEmployee(updatedEmployee: Employee) {

    this.employees.update(current =>
      current.map(emp =>
        emp.id === updatedEmployee.id
          ? updatedEmployee
          : emp
      )
    );
  }

}