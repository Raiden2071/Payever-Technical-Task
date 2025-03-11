import { Injectable, signal } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSignal = signal<Appointment[]>([]);

  appointments = this.appointmentsSignal.asReadonly();

  addAppointment(appointment: Appointment) {
    this.appointmentsSignal.update(apps => [...apps, appointment]);
  }

  removeAppointment(id: string) {
    this.appointmentsSignal.update(apps => apps.filter(a => a.id !== id));
  }

  updateAppointment(updated: Appointment) {
    this.appointmentsSignal.update(apps =>
      apps.map(a => (a.id === updated.id ? updated : a))
    );
  }
} 