import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentDialog } from './department-dialog';

describe('DepartmentDialog', () => {
  let component: DepartmentDialog;
  let fixture: ComponentFixture<DepartmentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
