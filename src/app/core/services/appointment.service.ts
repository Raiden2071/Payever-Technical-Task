import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../../core/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject$ = new BehaviorSubject<Appointment[]>([]);

  readonly appointments$: Observable<Appointment[]> = this.appointmentsSubject$.asObservable();

  addAppointment(appointment: Appointment): void {
    const currentAppointments = this.appointmentsSubject$.getValue();
    this.appointmentsSubject$.next([...currentAppointments, appointment]);
  }

  removeAppointment(id: string): void {
    const currentAppointments = this.appointmentsSubject$.getValue();
    this.appointmentsSubject$.next(currentAppointments.filter(appointment => appointment.id !== id));
  }

  updateAppointment(updated: Appointment): void {
    const currentAppointments = this.appointmentsSubject$.getValue();
    this.appointmentsSubject$.next(
      currentAppointments.map(appointment => (appointment.id === updated.id ? updated : appointment))
    );
  }
} 