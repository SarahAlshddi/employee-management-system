import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobTitleList } from './job-title-list';

describe('JobTitleList', () => {
  let component: JobTitleList;
  let fixture: ComponentFixture<JobTitleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTitleList],
    }).compileComponents();

    fixture = TestBed.createComponent(JobTitleList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
