import { Injectable, signal } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSignal = signal<Appointment[]>([]);

  appointments = this.appointmentsSignal.asReadonly();

  addAppointment(appointment: Appointment): void {
    this.appointmentsSignal.update(appointments => [...appointments, appointment]);
  }

  removeAppointment(id: string): void {
    this.appointmentsSignal.update(appointments => appointments.filter(appointment => appointment.id !== id));
  }

  updateAppointment(updated: Appointment): void {
    this.appointmentsSignal.update(appointments =>
      appointments.map(appointment => (appointment.id === updated.id ? updated : appointment))
    );
  }
} 