import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Appointment } from '../models/appointment.model';

export interface ConfirmDeleteDialogData {
  appointment: Appointment;
}

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDeleteModalComponent {
  public dialogRef = inject(MatDialogRef<ConfirmDeleteModalComponent>);
  public data = inject(MAT_DIALOG_DATA) as ConfirmDeleteDialogData;

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 