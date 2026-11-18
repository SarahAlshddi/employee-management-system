import { TestBed } from '@angular/core/testing';
import { JobTitle } from './job-title';

describe('JobTitle', () => {
  let service: JobTitle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobTitle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
