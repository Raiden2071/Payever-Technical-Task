import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private dialog = inject(MatDialog);
  private appointmentService = inject(AppointmentService);
  private destroyRef = inject(DestroyRef);

  openNewAppointmentDialog(): void {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '500px',
      data: { date: new Date() }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: Appointment | undefined) => {
        if (result) {
          this.appointmentService.addAppointment(result);
        }
      });
  }
} 