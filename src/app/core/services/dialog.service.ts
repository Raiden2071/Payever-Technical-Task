import { DestroyRef, inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentModalComponent } from '../../shared/dialogs/appointment-modal/appointment-modal.component';
import { AppointmentDialogData } from '../../shared/dialogs/appointment-modal/appointment-modal.component';
import { Appointment } from '../models/appointment.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppointmentService } from './appointment.service';
import { ConfirmDeleteDialogData, ConfirmDeleteModalComponent } from '../../shared/dialogs/confirm-delete-modal/confirm-delete-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog = inject(MatDialog);
  private appointmentService = inject(AppointmentService);
  private destroyRef = inject(DestroyRef);

  openAppointmentDialog(appointment?: Appointment, date?: Date): void {
    const dialogData: AppointmentDialogData = {
      appointment,
      date: date || new Date()
    };

    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '500px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: Appointment | undefined) => {
        if (result) {
          if (appointment) {
            this.appointmentService.updateAppointment(result);
          } else {
            this.appointmentService.addAppointment(result);
          }
        }
      });
  }

  openDeleteConfirmDialog(appointment: Appointment): void {
    const dialogData: ConfirmDeleteDialogData = {
      appointment
    };

    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: boolean | undefined) => {
        if (result) {
          this.appointmentService.removeAppointment(appointment.id);
        }
      });
  }
}
