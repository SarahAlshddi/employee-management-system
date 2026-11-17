import { Service, signal } from '@angular/core';
import type { Department } from '../department-list/department.model';

@Service()
export class DepartmentService {

  departments = signal<Department[]>([
    { id: 101, name: 'IT' },
    { id: 102, name: 'Human Resources' },
    { id: 103, name: 'Finance' },
    { id: 104, name: 'Marketing' }
  ]);

  addDepartment(name: string) {

    const newId = Math.max(
      0,
      ...this.departments().map(dep => dep.id)
    ) + 1;

    const newDepartment: Department = {
      id: newId,
      name: name.trim()
    };

    this.departments.update(current => [
      ...current,
      newDepartment
    ]);
  }

  updateDepartment(updatedDepartment: Department) {

    this.departments.update(current =>
      current.map(dep =>
        dep.id === updatedDepartment.id
          ? updatedDepartment
          : dep
      )
    );
  }

  deleteDepartment(id: number) {

    this.departments.update(current =>
      current.filter(dep => dep.id !== id)
    );
  }

}