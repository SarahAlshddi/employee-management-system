export interface Employee {
  id: number;
  fName: string;
  lName: string;

  position:
    | 'Frontend Developer'
    | 'Backend Developer'
    | 'UI/UX Designer'
    | 'Project Manager';

  salary: number;
}