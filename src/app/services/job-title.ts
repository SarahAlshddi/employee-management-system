import { Service, signal } from '@angular/core';
import type { JobTitle } from '../job-title-list/job-title.model';

@Service()
export class JobTitleService {

  jobTitles = signal<JobTitle[]>([
    {
      id: 201,
      name: 'Frontend Developer',
      description: 'Develops user interfaces',
      departmentId: 101
    },
    {
      id: 202,
      name: 'Backend Developer',
      description: 'Develops server-side APIs',
      departmentId: 101
    },
    {
      id: 203,
      name: 'UI/UX Designer',
      description: 'Designs user experiences',
      departmentId: 104
    },
    {
      id: 204,
      name: 'HR Specialist',
      description: 'Manages recruitment',
      departmentId: 102
    },
    {
      id: 205,
      name: 'Accountant',
      description: 'Handles financial records',
      departmentId: 103
    }
  ]);

  addJobTitle(data: Omit<JobTitle, 'id'>) {

    const newId = Math.max(
      0,
      ...this.jobTitles().map(job => job.id)
    ) + 1;

    const newJobTitle: JobTitle = {
      id: newId,
      ...data
    };

    this.jobTitles.update(current => [
      ...current,
      newJobTitle
    ]);
  }

  updateJobTitle(updatedJobTitle: JobTitle) {

    this.jobTitles.update(current =>
      current.map(job =>
        job.id === updatedJobTitle.id
          ? updatedJobTitle
          : job
      )
    );
  }

  deleteJobTitle(id: number) {

    this.jobTitles.update(current =>
      current.filter(job => job.id !== id)
    );
  }
}