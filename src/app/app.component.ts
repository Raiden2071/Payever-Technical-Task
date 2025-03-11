import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';
import { AppointmentService } from './services/appointment.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Appointment Calendar';
  
  private dialog = inject(MatDialog);
  private appointmentService = inject(AppointmentService);
  
  openNewAppointmentDialog(): void {
    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '500px',
      data: { date: new Date() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.addAppointment(result);
      }
    });
  }
}
