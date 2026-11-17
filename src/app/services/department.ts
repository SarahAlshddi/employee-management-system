import { Service, signal } from '@angular/core';
import type { Department } from '../department-list/department.model';

@Service()
export class DepartmentService {

  departments = signal<Department[]>([
    {
      id: 101,
      name: 'IT',
      description: 'Information Technology and Software Development'
    },
    {
      id: 102,
      name: 'Human Resources',
      description: 'Recruitment and Employee Relations'
    },
    {
      id: 103,
      name: 'Finance',
      description: 'Financial Management and Budgeting'
    },
    {
      id: 104,
      name: 'Marketing',
      description: 'Marketing and Advertising'
    }
  ]);

  // Add Department
  addDepartment(data: Omit<Department, 'id'>) {

    const newId = Math.max(
      0,
      ...this.departments().map(dep => dep.id)
    ) + 1;

    const newDepartment: Department = {
      id: newId,
      ...data
    };

    this.departments.update(current => [
      ...current,
      newDepartment
    ]);
  }

  // Update Department
  updateDepartment(updatedDepartment: Department) {

    this.departments.update(current =>
      current.map(dep =>
        dep.id === updatedDepartment.id
          ? updatedDepartment
          : dep
      )
    );
  }

  // Delete Department
  deleteDepartment(id: number) {

    this.departments.update(current =>
      current.filter(dep => dep.id !== id)
    );
  }

}