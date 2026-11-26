import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reason-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './reason-dialog.html',
  styleUrl: './reason-dialog.css'
})
export class ReasonDialog {
  reason = inject<string>(MAT_DIALOG_DATA);
}