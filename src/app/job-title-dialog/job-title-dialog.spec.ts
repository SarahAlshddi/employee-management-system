import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobTitleDialog } from './job-title-dialog';

describe('JobTitleDialog', () => {
  let component: JobTitleDialog;
  let fixture: ComponentFixture<JobTitleDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTitleDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(JobTitleDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
